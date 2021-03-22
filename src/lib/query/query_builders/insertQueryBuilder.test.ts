import buildInsertQuery from "./insertQueryBuilder";

describe("insertQueryBuilder", () => {
  it("should build a valid insert query", () => {
    expect(
      buildInsertQuery("table", ["col1", "col2", "col3"], ["val1", "val2", "val3"])
    ).toBe("INSERT INTO table (col1, col2, col3) VALUES ($1, $2, $3);");
  });
});
