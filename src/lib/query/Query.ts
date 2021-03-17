import { PoolClient } from "pg";
import { QueryMod } from "../../types";

import { buildInsertQuery } from "./query_builders";

export default class Query {
  private tableName: string;
  private client: PoolClient;

  constructor(tableName: string, client: PoolClient) {
    this.tableName = tableName;
    this.client = client;
  }

  public async insert<T>(data: Partial<T>): Promise<void> {
    await this.client.query(buildInsertQuery(this.tableName, Object.keys(data), Object.values(data)), Object.values(data));
  }

  public async all<T>(queryMods: QueryMod[], columns?: string[]): Promise<T[]> {
    const { rows } = await this.client.query("", []);

    return rows as T[];
  }

  public async find<T>(column: string, value: unknown): Promise<T> {
    const { rows: [ data ] } = await this.client.query("", []);

    return data as T;
  }

  public async update<T>(queryMods: QueryMod[], values: T): Promise<void> {
    await this.client.query("", []);
  }

  public async delete(queryMods: QueryMod[]): Promise<void> {
    await this.client.query("", []);
  }

  public async query<T>(queryStr: string, params: unknown[]): Promise<T[]> {
    const { rows } = await this.client.query(queryStr, params);

    return rows as T[];
  }
}
