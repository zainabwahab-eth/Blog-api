const mongoose = require("mongoose");
const request = require("supertest");
const { connect } = require("./database");
const app = require("./../app");

let mongoConnection;

beforeAll(async () => {
  mongoConnection = await connect();
});

afterEach(async () => {
  await mongoConnection.cleanup();
});

afterAll(async () => {
  await mongoConnection.disconnect();
  await mongoose.disconnect();
});

process.env.JWT_SECRET = "testingsecret";
process.env.JWT_EXPIRES_IN = "9h";

describe("User Auth", () => {
  const userData = {
    name: "Zainab Wahab",
    email: "test@gmail.com",
    password: "pass1234",
    confirmPassword: "pass1234",
  };

  it("Should sign up a user", async () => {
    const res = await request(app)
      .post("/users/signup")
      .set("content-type", "application/json")
      .send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    // console.log("Response body:", res.body);
  });

  it("Should fail login with wrong password", async () => {
    await request(app)
      .post("/users/signup")
      .set("content-type", "application/json")
      .send(userData);

    const res = await request(app)
      .post("/users/login")
      .set("content-type", "application/json")
      .send({
        email: userData.email,
        password: "pass123",
      });
    expect(res.statusCode).toBe(401);
  });

  it("Should fail login a user", async () => {
    await request(app)
      .post("/users/signup")
      .set("content-type", "application/json")
      .send(userData);

    const res = await request(app)
      .post("/users/login")
      .set("content-type", "application/json")
      .send({
        email: userData.email,
        password: userData.password,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
