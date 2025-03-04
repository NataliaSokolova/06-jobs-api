import get_chai from "../utils/get_chai.js";
import { app } from "../app.js";

describe("Test API endpoint", function () {
  it("should return status 200 and a message from the index page", async () => {
    const res = await request(app).get("/");

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message");
  });
});
