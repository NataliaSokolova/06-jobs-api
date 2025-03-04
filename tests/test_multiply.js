import { multiply } from "../utils/multiply.js";
import get_chai from "../utils/get_chai.js";
import { expect } from "chai";

describe("testing multiply", function () {
    it("should give 7*6 is 42", function () {
      const result = multiply(7, 6);
      expect(result).to.equal(42);
    });
    it("should give 5*5 is 25", function () {
        const result = multiply(5, 5);
        expect(result).to.equal(25);
      });
  });



