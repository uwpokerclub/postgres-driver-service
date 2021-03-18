import buildWhereQuery from "./whereQueryBuilder";
import { WhereQueryMod } from "../../../types";

describe("whereQueryBuilder", () => {
  it("should build an empty string if no where mods are present", () => {
    expect(buildWhereQuery([])).toBe("");
  });

  it("should build a WHERE clause with one expression", () => {
    const mod: WhereQueryMod[] = [
      {
        type: "where",
        and: true,
        parameters: ["hello"],
        toString(): string {
          return "expr = ?";
        }
      }
    ];

    expect(buildWhereQuery(mod)).toBe("WHERE expr = ?");
  });

  it("should build multiple where expressions", () => {
    const mods: WhereQueryMod[] = [
      {
        type: "where",
        and: true,
        parameters: ["hello"],
        toString(): string {
          return "expr = ?";
        }
      },
      {
        type: "where",
        and: true,
        parameters: ["world"],
        toString(): string {
          return "name = ?";
        }
      }
    ];

    expect(buildWhereQuery(mods)).toBe("WHERE expr = ? AND name = ?");
  });

  it("should build multiple where expressions with an OR", () => {
    const mods: WhereQueryMod[] = [
      {
        type: "where",
        and: true,
        parameters: ["hello"],
        toString(): string {
          return "expr = ?";
        }
      },
      {
        type: "where",
        and: false,
        parameters: ["world"],
        toString(): string {
          return "name = ?";
        }
      }
    ];

    expect(buildWhereQuery(mods)).toBe("WHERE expr = ? OR name = ?");
  });
});
