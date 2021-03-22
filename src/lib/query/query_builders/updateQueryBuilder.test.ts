import { QueryMod } from "../../../types";
import buildUpdateQuery from "./updateQueryBuilder";

describe("updateQueryBuilder", () => {
  it("should return an empty string if no columns are passed", () => {
    expect(buildUpdateQuery("table", [], [])).toBe("");
  });

  it("should build an UPDATE query with no WHERE", () => {
    expect(buildUpdateQuery("table", [], ["col1", "col2"])).toBe("UPDATE table SET col1 = ?, col2 = ?;");
  });

  it("should return a valid UPDATE query with a WHERE clause", () => {
    const queryMods: QueryMod[] = [
      {
        type: "where",
        and: true,
        parameters: ["hello"],
        toString(): string {
          return "col3 = ?";
        }
      }
    ];

    expect(buildUpdateQuery("table", queryMods, ["col1", "col2"])).toBe("UPDATE table SET col1 = ?, col2 = ? WHERE col3 = ?;");
  });
});
