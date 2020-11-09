import { QueryBuilder } from "./QueryBuilder";

describe("build", () => {
  describe("CREATE queries", () => {
    test("correctly builds a CREATE query", () => {
      const qb = new QueryBuilder();

      const meta = {
        table: "table",
        statementType: "CREATE",
        columns: ["col1", "col2", "col3"],
        parameters: ["val1", "val2", "val3"]
      };

      expect(qb.build(meta)).toBe("INSERT INTO table (col1, col2, col3) VALUES ($1, $2, $3);");
    });
  });

  describe("SELECT queries", () => {
    test("correctly builds a select all query", () => {
      const qb = new QueryBuilder();

      const meta = {
        table: "table",
        statementType: "SELECT",
        columns: [] as string[],
      };

      expect(qb.build(meta)).toBe("SELECT * FROM table;");
    });

    test("correctly builds a select query with columns", () => {
      const qb = new QueryBuilder();

      const meta = {
        table: "table",
        statementType: "SELECT",
        columns: ["col"]
      };

      expect(qb.build(meta)).toBe("SELECT col FROM table;");
    });

    test("correctly builds a select query with a where clause", () => {
      const qb = new QueryBuilder();

      const meta = {
        table: "table",
        statementType: "SELECT",
        columns: [] as string[],
        filter: {
          where: {
            query: "id = ?",
            parameters: ["123"]
          }
        }
      };

      expect(qb.build(meta)).toBe("SELECT * FROM table WHERE id = $1;");
    });

    test("correctly builds a select query with an order by", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "SELECT",
        columns: [] as string[],
        filter: {
          order: {
            columns: ["col"],
            direction: "ASC"
          }
        }
      })).toBe("SELECT * FROM table ORDER BY col ASC;");
    });

    test("correctly builds a select query with a limit and offset", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "SELECT",
        columns: [] as string[],
        filter: {
          limit: 100,
          offset: 100
        }
      })).toBe("SELECT * FROM table LIMIT 100 OFFSET 100;");
    });
  });

  describe("UPDATE queries", () => {
    test("correctly builds an update all query", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "UPDATE",
        columns: ["col1", "col2"],
        parameters: ["val1", "val2"],
      })).toBe("UPDATE table SET col1 = $1, col2 = $2;");
    });

    test("correctly builds an update query with a where clause", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "UPDATE",
        columns: ["col1", "col2"],
        parameters: ["val1", "val2"],
        filter: {
          where: {
            query: "id = ?",
            parameters: ["123"]
          }
        }
      })).toBe("UPDATE table SET col1 = $1, col2 = $2 WHERE id = $3;");
    });
  });

  describe("DELETE queries", () => {
    test("correctly builds a delete all query", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "DELETE",
      })).toBe("DELETE FROM table;");
    });

    test("correctly builds a delete query with a where clause", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "DELETE",
        filter: {
          where: {
            query: "id = ?",
            parameters: ["123"]
          }
        }
      })).toBe("DELETE FROM table WHERE id = $1;");
    });
  });

  describe("COUNT queries", () => {
    test("correctly builds a count all query", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "COUNT",
      })).toBe("SELECT COUNT(*) FROM table;");
    });

    test("correctly builds a count query with a where clause", () => {
      const qb = new QueryBuilder();

      expect(qb.build({
        table: "table",
        statementType: "COUNT",
        filter: {
          where: {
            query: "id = ?",
            parameters: ["123"]
          }
        }
      })).toBe("SELECT COUNT(*) FROM table WHERE id = $1;");
    });
  });
});
