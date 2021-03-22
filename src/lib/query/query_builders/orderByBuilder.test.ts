import { GeneralQueryMod } from "../../../types";
import buildOrderBy from "./orderByBuilder";

describe("orderByBuilder", () => {
  it("should build a single order by clause", () => {
    const mods: GeneralQueryMod[] = [
      {
        type: "order",
        toString(): string {
          return "col1 ASC";
        }
      }
    ];

    expect(buildOrderBy(mods)).toBe("ORDER BY col1 ASC");
  });

  it("should build multiple order by clauses", () => {
    const mods: GeneralQueryMod[] = [
      {
        type: "order",
        toString(): string {
          return "col1 ASC";
        }
      },
      {
        type: "order",
        toString(): string {
          return "col2 DESC";
        }
      }
    ];

    expect(buildOrderBy(mods)).toBe("ORDER BY col1 ASC, col2 DESC");
  });
});
