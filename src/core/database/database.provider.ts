import { Client, Pool } from "pg";
import fs from "fs";
import { ConnectionOptions } from "tls";

export class DatabaseProvider {
  private static pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    ssl: this.readCertificate(),
  });

  private static readCertificate(): ConnectionOptions | null {
    if (process.env.NODE_ENV == "production") {
      return {
        rejectUnauthorized: process.env.NODE_ENV === "production",
        ca: process.env.AWS_DB_CERTS,
      };
    } else {
      return null;
    }
  }

  async query<T = any>(query: string, params?: any[]): Promise<T[]> {
    const result = await DatabaseProvider.pool.query<T>({
      text: query,
      values: params,
    });

    return result.rows;
  }
}
