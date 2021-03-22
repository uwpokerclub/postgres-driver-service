import { QueryMod } from "../../../types";
import buildCountQuery from "./countQueryBuilder";

describe("countQueryBuilder", () => {
  it("should build a count all query with no mods", () => {
    expect(buildCountQuery("table", [])).toBe("SELECT COUNT(*) FROM table;");
  });

  it("should build count query with WHERE clause", () => {
    const mods: QueryMod[] = [
      {
        type: "where",
        and: true,
        parameters: ["hello"],
        toString(): string {
          return "name = ?";
        }
      }
    ];

    expect(buildCountQuery("table", mods)).toBe("SELECT COUNT(*) FROM table WHERE name = ?;");
  });
});
