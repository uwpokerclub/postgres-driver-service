import { Pool, PoolClient, ConnectionConfig } from "pg";

export default class ConnectionPool {
  private pool: Pool;

  public constructor(connectionString: string, options?: ConnectionConfig ) {
    this.pool = new Pool({ connectionString, ...options });
  }

  public async getConnection(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async end(): Promise<void> {
    return this.pool.end();
  }
}
