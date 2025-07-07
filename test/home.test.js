const request = require("supertest");
const { connect } = require("./database");
const app = require("./../app");

let mongoConnection;

beforeAll(async () => {
  mongoConnection = await connect();
});

afterAll(async () => {
  await mongoConnection.disconnect();
});

describe("Home Route", () => {
  it("Should return status true", async () => {
    const res = await request(app)
      .get("/blogs")
      .set("content-type", "application/json");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });

  it("Should return error when routed to undefined route", async () => {
    const res = await request(app)
      .get("/undefined")
      .set("content-type", "application/json");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Route not found");
  });
});
