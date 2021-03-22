import { Pool, PoolClient } from "pg";

export default class ConnectionPool {
  private pool: Pool;

  public constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async getConnection(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async end(): Promise<void> {
    return this.pool.end();
  }
}
