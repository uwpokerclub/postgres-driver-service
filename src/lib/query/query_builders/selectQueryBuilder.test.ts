import { QueryMod } from "../../../types";
import buildSelectQuery from "./selectQueryBuilder";

describe("selectQueryBuilder", () => {
  it("should build a basic SELECT all query", () => {
    expect(buildSelectQuery("table", [])).toBe("SELECT * FROM table;");
  });

  it("should build a basic SELECT query with columns", () => {
    expect(buildSelectQuery("table", [], ["col1", "col2"])).toBe("SELECT col1, col2 FROM table;");
  });

  it("should build a query with a WHERE clause", () => {
    const queryMods: QueryMod[] = [
      {
        type: "where",
        and: true,
        parameters: ["hello"],
        toString(): string {
          return "col1 = ?";
        }
      }
    ];

    expect(buildSelectQuery("table", queryMods)).toBe("SELECT * FROM table WHERE col1 = ?;");
  });

  it("should build a query with an ORDER BY clause", () => {
    const queryMods: QueryMod[] = [
      {
        type: "order",
        toString(): string {
          return "col1 ASC";
        }
      }
    ];

    expect(buildSelectQuery("table", queryMods)).toBe("SELECT * FROM table ORDER BY col1 ASC;");
  });

  it("should build a query with limit and offset clause", () => {
    const queryMods: QueryMod[] = [
      {
        type: "general",
        toString(): string {
          return "LIMIT 10";
        }
      },
      {
        type: "general",
        toString(): string {
          return "OFFSET 10";
        }
      }
    ];

    expect(buildSelectQuery("table", queryMods)).toBe("SELECT * FROM table LIMIT 10 OFFSET 10;");
  });

  it("should build a complex query", () => {
    const queryMods: QueryMod[] = [
      {
        type: "general",
        toString(): string {
          return "LIMIT 10";
        }
      },
      {
        type: "general",
        toString(): string {
          return "OFFSET 10";
        }
      },
      {
        type: "order",
        toString(): string {
          return "col1 ASC";
        }
      },
      {
        type: "where",
        and: true,
        parameters: ["hello"],
        toString(): string {
          return "col1 = ?";
        }
      },
      {
        type: "where",
        and: true,
        parameters: ["world"],
        toString(): string {
          return "col2 = ?";
        }
      },
    ];

    expect(
      buildSelectQuery("table", queryMods, ["col1", "col2"])
    ).toBe("SELECT col1, col2 FROM table WHERE col1 = ? AND col2 = ? ORDER BY col1 ASC LIMIT 10 OFFSET 10;");
  });
});
