import request from 'supertest';
import { app } from "../app.js";

describe("Test API endpoint", () => {
  it("should get the index page", async () => {
    const res = await request(app).get("/test");

    expect(res.status).toBe(200);
    expect(res.type).toContain("text");
    expect(res.text).toContain("Hello from server");
  });
});
