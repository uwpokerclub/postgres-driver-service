import { convertToParameters } from "./utils";

describe("convertToParameter", () => {
  it("should properly convert to a parameter list", () => {
    expect(convertToParameters(["a", "b"])).toEqual(["$1", "$2"]);
  });
});
