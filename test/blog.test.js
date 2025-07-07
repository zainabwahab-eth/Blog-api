const request = require("supertest");
const app = require("../app");
const { connect } = require("./database");
const Blog = require("../models/blogModel");

const userSignup = {
  name: "Zainab Wahab",
  email: "zainab@example.com",
  password: "pass1234",
  confirmPassword: "pass1234",
};

describe("Blog API", () => {
  process.env.JWT_SECRET = "testingsecret";
  process.env.JWT_EXPIRES_IN = "9h";

  let conn;
  let token;
  let user;

  beforeAll(async () => {
    conn = await connect();

    const res = await request(app).post("/users/signup").send(userSignup);

    token = res.body.token;
    user = res.body.message.user;
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should create a blog", async () => {
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Node Testing",
        body: "This is a test blog post",
        tags: ["node", "test"],
        author_id: user._id,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.blog).toHaveProperty("title", "Node Testing");
  });

  it("should return published blogs only", async () => {
    await Blog.create({
      title: "Public Blog",
      body: "This is published",
      tags: ["public"],
      author: user._id,
      state: "published",
    });

    await Blog.create({
      title: "Draft Blog",
      body: "This is a draft",
      tags: ["draft"],
      author: user._id,
      state: "draft",
    });

    const res = await request(app).get("/blogs");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.blogs.length).toBe(1);
    expect(res.body.data.blogs[0].state).toBe("published");
  });

  it("should get a single blog and increment read count", async () => {
    const blog = await Blog.create({
      title: "Single Blog",
      body: "Read me",
      state: "published",
      tags: ["read"],
      author: user._id,
      read_count: 0,
    });

    const res = await request(app).get(`/blogs/${blog._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.blog.read_count).toBe(1);
  });

  it("should update a blog", async () => {
    const userRes = await request(app).post("/users/signup").send(userSignup);

    token = userRes.body.token;
    user = userRes.body.message.user;

    const blog = await Blog.create({
      title: "Update Me",
      body: "Original",
      tags: ["edit"],
      state: "draft",
      author: user._id,
    });

    const res = await request(app)
      .patch(`/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ body: "Updated Body" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.blog.body).toBe("Updated Body");
  });

  it("should delete a blog", async () => {
    const userRes = await request(app).post("/users/signup").send(userSignup);

    token = userRes.body.token;
    user = userRes.body.message.user;

    const blog = await Blog.create({
      title: "Delete Me",
      body: "Remove me",
      state: "draft",
      tags: [],
      author: user._id,
    });

    const res = await request(app)
      .delete(`/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });

  it("should publish a blog", async () => {
    const userRes = await request(app).post("/users/signup").send(userSignup);

    token = userRes.body.token;
    user = userRes.body.message.user;

    const blog = await Blog.create({
      title: "Unpublished",
      body: "Waiting to go live",
      state: "draft",
      tags: [],
      author: user._id,
    });

    const res = await request(app)
      .patch(`/blogs/${blog._id}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.blog.state).toBe("published");
  });
});
