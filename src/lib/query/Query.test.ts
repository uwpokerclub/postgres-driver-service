import Query from "./Query";
import { QueryMod } from "../../types";
import PgMock2, { getPool } from 'pgmock2';

// Setup mock DB
const pg = new PgMock2;
const pool = getPool(pg);

type User = {
  id: number;
  first_name: string;
  last_name: string;
  paid: boolean;
};

describe("Query", () => {
  describe("#insert", () => {
    it("should insert data", async () => {
      pg.add(
        "INSERT INTO users (id, first_name, last_name, paid) VALUES ($1, $2, $3, $4);",
        ["number", "string", "string", "boolean"],
        {}
      );

      const client = await pool.connect();

      const query = new Query("users", client);
      await query.insert<User>({
        id: 4,
        first_name: "adam",
        last_name: "mahood",
        paid: false
      });

      client.release();
    });
  });

  describe("#count", () => {
    it("should get count of all records", async () => {
      pg.add("SELECT COUNT(*) FROM users;", [], {
        rowCount: 1,
        rows: [
          { count: 3 }
        ]
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const count = await query.count([]);

      expect(count).toBe(3);

      client.release();
    });

    it("should get count of filtered records", async () => {
      pg.add("SELECT COUNT(*) FROM users WHERE paid = $1;", ["boolean"], {
        rowCount: 1,
        rows: [
          { count: 2 }
        ]
      });

      const client = await pool.connect();

      const queryMods: QueryMod[] = [
        {
          type: "where",
          and: true,
          parameters: [true],
          toString(): string {
            return "paid = ?";
          }
        }
      ];

      const query = new Query("users", client);
      const count = await query.count(queryMods);

      expect(count).toBe(2);

      client.release();
    });
  });

  describe("#all", () => {
    it("should select all results", async () => {
      pg.add("SELECT * FROM users;", [], {
        rowCount: 3,
        rows: [
          { id: 1, first_name: "john", last_name: "smith", paid: false },
          { id: 2, first_name: "sally", last_name: "jade", paid: true },
          { id: 3, first_name: "jane", last_name: "doe", paid: true },
        ]
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const res = await query.all([]);

      expect(res).toHaveLength(3);
      expect(res).toContainEqual({
        "id": 1,
        "first_name": "john",
        "last_name": "smith",
        "paid": false
      });
      expect(res).toContainEqual({
        "id": 2,
        "first_name": "sally",
        "last_name": "jade",
        "paid": true
      });
      expect(res).toContainEqual({
        "id": 3,
        "first_name": "jane",
        "last_name": "doe",
        "paid": true
      });

      client.release();
    });

    it("should select with columns", async () => {

    });


  });

  describe("#find", () => {});

  describe("#update", () => {});

  describe("#delete", () => {});

  describe("#query", () => {});
});
