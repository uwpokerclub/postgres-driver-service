import Query from "./Query";
import { OrderByDirections, QueryMod } from "../../types";
import PgMock2, { getPool } from 'pgmock2';

import { where, orderBy, limit, offset } from "../query/query_mods";

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
      pg.add("SELECT id, first_name FROM users;", [], {
        rowCount: 3,
        rows: [
          { id: 1, first_name: "john" },
          { id: 2, first_name: "sally" },
          { id: 3, first_name: "jane" },
        ]
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const res = await query.all([], ["id", "first_name"]);

      expect(res).toHaveLength(3);
      expect(res).toContainEqual({
        "id": 1,
        "first_name": "john",
      });
      expect(res).toContainEqual({
        "id": 2,
        "first_name": "sally",
      });
      expect(res).toContainEqual({
        "id": 3,
        "first_name": "jane",
      });

      client.release();
    });

    it("should select with where clause", async () => {
      pg.add("SELECT * FROM users WHERE paid = $1;", ['boolean'], {
        rowCount: 2,
        rows: [
          { id: 2, first_name: "sally", last_name: "jade", paid: true },
          { id: 3, first_name: "jane", last_name: "doe", paid: true },
        ]
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const res = await query.all([where("paid = ?", [true])]);

      expect(res).toHaveLength(2);
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

    it("should select with an order by", async () => {
      pg.add("SELECT * FROM users ORDER BY first_name ASC;", [], {
        rowCount: 3,
        rows: [
          { id: 3, first_name: "jane", last_name: "doe", paid: true },
          { id: 1, first_name: "john", last_name: "smith", paid: false },
          { id: 2, first_name: "sally", last_name: "jade", paid: true },
        ]
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const res = await query.all([orderBy("first_name", "ASC")]);

      expect(res).toHaveLength(3);
      expect(res[0]).toEqual({
        "id": 3,
        "first_name": "jane",
        "last_name": "doe",
        "paid": true
      });
      expect(res[1]).toEqual({
        "id": 1,
        "first_name": "john",
        "last_name": "smith",
        "paid": false
      });
      expect(res[2]).toEqual({
        "id": 2,
        "first_name": "sally",
        "last_name": "jade",
        "paid": true
      });

      client.release();
    });

    it("should select with a limit and offset", async () => {
      pg.add("SELECT * FROM users LIMIT 1 OFFSET 1;", [], {
        rowCount: 1,
        rows: [
          { id: 2, first_name: "sally", last_name: "jade", paid: true },
        ],
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const res = await query.all([limit(1), offset(1)]);
      expect(res).toHaveLength(1);
      expect(res[0]).toEqual(
        { id: 2, first_name: "sally", last_name: "jade", paid: true }
      );
    });
  });

  describe("#find", () => {
    it("should return undefined if no result is found", async () => {
      pg.add("SELECT * FROM users WHERE id = $1 LIMIT 1;", ["number"], {
        rowCount: 0,
        rows: []
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const res = await query.find("id", 1);
      expect(res).toBeUndefined();
    });

    it("should return the correct result if it exists", async () => {
      pg.add("SELECT * FROM users WHERE id = $1 LIMIT 1;", ["number"], {
        rowCount: 1,
        rows: [
          { id: 1, first_name: "jane", last_name: "doe", paid: true }
        ]
      });

      const client = await pool.connect();

      const query = new Query("users", client);
      const res = await query.find("id", 1);
      expect(res).toEqual({ id: 1, first_name: "jane", last_name: "doe", paid: true });
    });
  });

  describe("#update", () => {
    it("should run an update query", async () => {
      pg.add("UPDATE users SET first_name = $1 WHERE id = $2;", ["string", "number"], {});

      const client = await pool.connect();

      const query = new Query("users", client);
      await query.update([where("id = ?", [1])], {
        first_name: "updated"
      });
    });
  });

  describe("#delete", () => {
    it("should delete a record", async () => {
      pg.add("DELETE FROM users WHERE id = $1;", ["number"], {});

      const client = await pool.connect();

      const query = new Query("users", client);
      await query.delete([where("id = ?", [1])]);
    });
  });

  describe("#query", () => {
    it("should preform a random query", async () => {
      pg.add("SELECT NOW();", [], {});

      const client = await pool.connect();
      await new Query("", client).query("SELECT NOW();", []);
    });
  });
});
