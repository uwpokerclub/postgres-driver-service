import { Pool, PoolClient } from "pg";
import { QueryBuilder, QueryMeta } from "./QueryBuilder";

interface QueryData {
  [key:string]: unknown
}

interface QueryResult {
  [key:string]: unknown
}

export class DriverService {
  private pool: Pool;
  private qb: QueryBuilder;
  private queryMeta: QueryMeta;

  public constructor(pool: Pool) {
    this.pool = pool;

    this.initQueryMeta();

    this.qb = new QueryBuilder();
  }

  public async query(queryStr: string, ...params: unknown[]): Promise<unknown[]> {
    const { rows } = await this.pool.query(queryStr, params);
    return rows as unknown[];
  }

  public async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public table(name: string): this {
    this.queryMeta.table = name;
    return this;
  }

  public create(data: QueryData): this {
    this.queryMeta.statementType = "CREATE";
    this.queryMeta.columns = Object.keys(data);
    this.queryMeta.parameters = Object.values(data);
    return this;
  }

  public select(...columns: string[]): this {
    this.queryMeta.statementType = "SELECT";
    this.queryMeta.columns = columns;
    return this;
  }

  public update(data: QueryData): this {
    this.queryMeta.statementType = "UPDATE";
    this.queryMeta.columns = Object.keys(data);
    this.queryMeta.parameters = Object.values(data);
    return this;
  }

  public delete(): this {
    this.queryMeta.statementType = "DELETE";
    return this;
  }

  public async count(): Promise<number> {
    this.queryMeta.statementType = "COUNT";
    const [{ count }] = await this.execute();
    return Number(count);
  }

  public where(query: string, ...parameters: unknown[]): this {
    this.queryMeta.filter.where = {
      query,
      parameters,
    };
    return this;
  }

  public orderBy(direction: string, ...columns: string[]): this {
    this.queryMeta.filter.order = {
      columns,
      direction
    };
    return this;
  }

  public limit(n: number): this {
    this.queryMeta.filter.limit = n;
    return this;
  }

  public offset(n: number): this {
    this.queryMeta.filter.offset = n;
    return this;
  }

  public async execute(): Promise<QueryResult[]> {
    const query = this.qb.build(this.queryMeta);
    const params = this.queryMeta.parameters.concat(this.queryMeta.filter.where ? this.queryMeta.filter.where.parameters : []);

    const client = await this.connect();
    try {
      const { rows } = await client.query(query, params);

      return rows;
    } catch (err) {
      throw new Error(`DBDRIVER::FAILED_QUERY ${query} : ${err}`);
    } finally {
      this.initQueryMeta();
      client.release();
    }
  }

  private initQueryMeta(): void {
    this.queryMeta = {
      table: null,
      statementType: null,
      columns: [],
      parameters: [],
      filter: {}
    };
  }
}
