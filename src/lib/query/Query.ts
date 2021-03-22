import { PoolClient } from "pg";
import { QueryMod, WhereQueryMod } from "../../types";

import { buildCountQuery, buildDeleteQuery, buildInsertQuery, buildSelectQuery, buildUpdateQuery } from "./query_builders";
import { convertToParameters } from "./query_builders/utils";
import { limit, where } from "./query_mods";

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

  public async count(queryMods: QueryMod[]): Promise<number> {
    const args = queryMods.filter((q) => q.type === "where").map((q: WhereQueryMod) => q.parameters).flat();
    const params = convertToParameters(args);
    const countQuery = buildCountQuery(this.tableName, queryMods).replace(/\?/gi, () => params.shift());

    const { rows: [ { count }]} = await this.client.query(countQuery, params);
    return Number(count);
  }

  public async all<T>(queryMods: QueryMod[], columns?: string[]): Promise<T[]> {
    const args = queryMods.filter((q) => q.type === "where").map((q: WhereQueryMod) => q.parameters).flat();
    const params = convertToParameters(args);
    const selectQuery = buildSelectQuery(this.tableName, queryMods, columns).replace(/\?/gi, () => params.shift());

    const { rows } = await this.client.query(selectQuery, args);
    return rows as T[];
  }

  public async find<T>(column: string, value: unknown): Promise<T> {
    const whereMod = where(`${column} = ?`, [value]);
    const params = convertToParameters([value]);
    const selectQuery = buildSelectQuery(this.tableName, [whereMod, limit(1)]).replace(/\?/gi, () => params.shift());

    const { rows: [ data ] } = await this.client.query(selectQuery, [value]);
    return data as T;
  }

  public async update<T>(queryMods: QueryMod[], values: Partial<T>): Promise<void> {
    const columns = Object.keys(values);

    const args = [Object.values(values), queryMods.filter((q) => q.type === "where").map((q: WhereQueryMod) => q.parameters)].flat(2);
    const params = convertToParameters(args);
    const updateQuery = buildUpdateQuery(this.tableName, queryMods, columns).replace(/\?/gi, () => params.shift());

    await this.client.query(updateQuery, params);
  }

  public async delete(queryMods: QueryMod[]): Promise<void> {
    const args = queryMods.filter((q) => q.type === "where").map((q: WhereQueryMod) => q.parameters).flat();
    const params = convertToParameters(args);
    const deleteQuery = buildDeleteQuery(this.tableName, queryMods).replace(/\?/gi, () => params.shift());

    await this.client.query(deleteQuery, params);
  }

  public async query<T>(queryStr: string, params: unknown[]): Promise<T[]> {
    const { rows } = await this.client.query(queryStr, params);

    return rows as T[];
  }
}
