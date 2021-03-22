import buildDeleteQuery from './deleteQueryBuilder';
import { QueryMod } from '../../../types';

describe("deleteQueryBuilder", () => {
  it("should build a delete all query with no mods", () => {
    expect(buildDeleteQuery("table", [])).toBe("DELETE FROM table;");
  });

  it("should build a delete query with WHERE mods", () => {
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

    expect(buildDeleteQuery("table", mods)).toBe("DELETE FROM table WHERE name = ?;");
  });
});
