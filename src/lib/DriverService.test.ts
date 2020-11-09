import { DriverService } from "./DriverService";

import { Pool } from "pg";

// Mock query builder
import { mocked } from "ts-jest/utils";
import { QueryBuilder } from "./QueryBuilder";

const buildMock = jest.fn();

jest.mock("./QueryBuilder", () => {
  return {
    QueryBuilder: jest.fn().mockImplementation(() => {
      return {
        build: buildMock
      };
    })
  };
});

// Connect to pg pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Setup test database
beforeAll(async () => {
  await pool.query(`CREATE TABLE users (
    id INTEGER,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    username VARCHAR(50),
    paid BOOLEAN
  );`);

  await pool.query(
    `INSERT INTO users (id, first_name, last_name, username, paid) VALUES ($1, $2, $3, $4, $5);`,
    [1, "john", "smith", "jsmith", false]
  );
  await pool.query(
    `INSERT INTO users (id, first_name, last_name, username, paid) VALUES ($1, $2, $3, $4, $5);`,
    [2, "sally", "jade", "jade_sally", true]
  );
  await pool.query(
    `INSERT INTO users (id, first_name, last_name, username, paid) VALUES ($1, $2, $3, $4, $5);`,
    [3, "jane", "doe", "doedoe", true]
  );
});

// Cleanup test database
afterAll(async () => {
  await pool.query("DROP TABLE users;");
  await pool.end();
});

describe("DriverService", () => {
  const QueryBuilderMock = mocked(QueryBuilder, true);

  beforeEach(() => {
    QueryBuilderMock.mockClear();
  });

  describe("#count", () => {
    test("should return the correct total count", async () => {
      buildMock.mockReturnValue("SELECT COUNT(*) FROM users;");

      const ds = new DriverService(pool);

      const count = await ds.table("users").count();
      expect(count).toBe(3);
    });

    test("should return the correct count when filtered", async () => {
      buildMock.mockReturnValue("SELECT COUNT(*) FROM users WHERE paid = $1;");

      const ds = new DriverService(pool);

      const count = await ds.table("users").where("paid = ?", true).count();
      expect(count).toBe(2);
    });
  });

  describe("#execute", () => {
    test("creating a record should be successful", async () => {
      buildMock.mockReturnValue("INSERT INTO users (id, first_name, last_name, username, paid) VALUES ($1, $2, $3, $4, $5);");

      const ds = new DriverService(pool);

      const res = await ds.table("users").create({
        "id": "4",
        "first_name": "tom",
        "last_name": "hanks",
        "username": "thanks",
        "paid": "false"
      }).execute();

      expect(res).toBeDefined();

      // delete record after
      await pool.query("DELETE FROM users WHERE id = $1;", [4]);
    });

    test("select all should return the entire table", async () => {
      buildMock.mockReturnValue("SELECT * FROM users;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").select().execute();
      expect(res).toHaveLength(3);
      expect(res).toContainEqual({
        "id": 1,
        "first_name": "john",
        "last_name": "smith",
        "username": "jsmith",
        "paid": false
      });
      expect(res).toContainEqual({
        "id": 2,
        "first_name": "sally",
        "last_name": "jade",
        "username": "jade_sally",
        "paid": true
      });
      expect(res).toContainEqual({
        "id": 3,
        "first_name": "jane",
        "last_name": "doe",
        "username": "doedoe",
        "paid": true
      });
    });

    test("selecting with columns should only return those columns", async () => {
      buildMock.mockReturnValue("SELECT id, first_name FROM users;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").select("id", "first_name").execute();
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
    });

    test("select with filter should return correct values", async () => {
      buildMock.mockReturnValue("SELECT * FROM users WHERE paid = $1;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").select().where("paid = ?", true).execute();
      expect(res).toHaveLength(2);
      expect(res).toContainEqual({
        "id": 2,
        "first_name": "sally",
        "last_name": "jade",
        "username": "jade_sally",
        "paid": true
      });
      expect(res).toContainEqual({
        "id": 3,
        "first_name": "jane",
        "last_name": "doe",
        "username": "doedoe",
        "paid": true
      });
    });

    test("select with order should return the correct order", async () => {
      buildMock.mockReturnValue("SELECT * FROM users ORDER BY first_name ASC;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").select().orderBy("ASC", "first_name").execute();
      expect(res).toHaveLength(3);
      expect(res[0]).toStrictEqual({
        "id": 3,
        "first_name": "jane",
        "last_name": "doe",
        "username": "doedoe",
        "paid": true
      });
      expect(res[1]).toStrictEqual({
        "id": 1,
        "first_name": "john",
        "last_name": "smith",
        "username": "jsmith",
        "paid": false
      });
      expect(res[2]).toStrictEqual({
        "id": 2,
        "first_name": "sally",
        "last_name": "jade",
        "username": "jade_sally",
        "paid": true
      });
    });

    test("select with limit should return the correct limit", async () => {
      buildMock.mockReturnValue("SELECT * FROM users LIMIT 1;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").select().limit(1).execute();
      expect(res).toHaveLength(1);
    });

    test("select with offset should return the correct amount", async () => {
      buildMock.mockReturnValue("SELECT * FROM users OFFSET 1;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").select().offset(1).execute();
      expect(res).toHaveLength(2);
    });

    test("select with limit, offset and order by should return the correct", async () => {
      buildMock.mockReturnValue("SELECT * FROM users ORDER BY first_name ASC LIMIT 1 OFFSET 1;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").select().orderBy("ASC", "first_name").limit(1).offset(1).execute();
      expect(res).toHaveLength(1);
      expect(res[0]).toStrictEqual({
        "id": 1,
        "first_name": "john",
        "last_name": "smith",
        "username": "jsmith",
        "paid": false
      });
    });

    test("updating a record should be successful", async () => {
      buildMock.mockReturnValue("UPDATE users SET first_name = $1 WHERE id = $2;");

      const ds = new DriverService(pool);

      const res = await ds
        .table("users")
        .update({"first_name": "updated"})
        .where("id = ?", 1)
        .execute();

      expect(res).toBeDefined();

      // get record to check if it was updated
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1;", [1]);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toStrictEqual({
        "id": 1,
        "first_name": "updated",
        "last_name": "smith",
        "username": "jsmith",
        "paid": false
      });
    });

    test("updating all records should be successful", async () => {
      buildMock.mockReturnValue("UPDATE users SET paid = $1;");

      const ds = new DriverService(pool);

      const res = await ds
        .table("users")
        .update({
          "paid": true
        })
        .execute();

      expect(res).toBeDefined();

      // get records to check if they were updated
      const { rows } = await pool.query("SELECT * FROM users;");
      const paidValues = rows.map((v) => v.paid);
      // No false values should be present
      expect(paidValues).toHaveLength(3);
      expect(paidValues).not.toContain(false);
    });

    test("deleting a single record should remove it from the db", async () => {
      buildMock.mockReturnValue("DELETE FROM users WHERE id = $1;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").delete().where("id = ?", 1).execute();
      expect(res).toBeDefined();

      // record count should be less
      const { rows } = await pool.query("SELECT * FROM users;");
      expect(rows).toHaveLength(2);
    });

    test("deleting all records should clear the table", async () => {
      buildMock.mockReturnValue("DELETE FROM users;");

      const ds = new DriverService(pool);

      const res = await ds.table("users").delete().execute();
      expect(res).toBeDefined();

      // record count should be zero
      const { rows } = await pool.query("SELECT * FROM users;");
      expect(rows).toHaveLength(0);
    });
  });
});
