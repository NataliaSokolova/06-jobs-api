import { multiply } from "../utils/multiply.js";

describe("testing multiply", () => {
  test("should give 7 * 6 as 42", () => {
    expect(multiply(7, 6)).toBe(42);
  });

  test("should give 5 * 5 as 25", () => {
    expect(multiply(5, 5)).toBe(25);
  });
});