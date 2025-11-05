import { Pool } from "pg";
import { text } from "stream/consumers";

export class DatabaseProvider {
  private static pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
  });

  async query<T = any>(query: string, params?: any[]): Promise<T[]> {
    const result = await DatabaseProvider.pool.query<T>({
      text: query,
      values: params,
    });

    return result.rows;
  }
}
