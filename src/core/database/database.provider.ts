import { Pool } from "pg";
import fs from "fs";

export class DatabaseProvider {
  private static pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    ssl: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
      ca: DatabaseProvider.readCertificate(),
    },
  });

  private static readCertificate(): string | null {
    if (process.env.NODE_ENV == "production") {
      return process.env.AWS_DB_CERTS;
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
