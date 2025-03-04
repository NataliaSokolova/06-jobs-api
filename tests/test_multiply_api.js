import get_chai from "../utils/get_chai.js";
import { app } from "../app.js";

describe("Test Multiply API", function () {
  it("should multiply two numbers", async () => {
    const res = await request(app).get("/multiply").query({ first: 7, second: 6 });

    expect(res).to.have.status(200);
    expect(res).to.have.property("body");
    expect(res.body).to.have.property("result");
    expect(res.body.result).to.equal(42);
  });
});