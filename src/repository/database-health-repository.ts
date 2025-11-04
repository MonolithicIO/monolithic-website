import databasePool from "@core/database";
import DatabaseHealthModel from "@model/database-health.model";
import { Pool } from "pg";

export default class DatabaseHealthRepository {
  private readonly database: Pool;

  constructor() {
    this.database = databasePool;
  }

  async getDatabaseHealth(): Promise<DatabaseHealthModel | undefined> {
    try {
      const response = (await databasePool.query(DatabaseHealthRepository.statusQuery)).rows[0];

      return Promise.resolve({
        isOnline: response.healthy,
        connectionsAvailable: response.connections_available,
        openConnections: response.open_connections,
        latency: response.latency,
      });
    } catch (err) {
      return undefined;
    }
  }

  private static readonly statusQuery = `
    WITH
    latency_test AS (
      SELECT
        EXTRACT(MILLISECONDS FROM (clock_timestamp() - statement_timestamp())) AS latency_ms
      FROM generate_series(1, 3)
      LIMIT 3
    ),
    db_info AS (
      SELECT
        version() AS postgres_version,
        (
          SELECT setting::int
          FROM pg_settings
          WHERE name = 'max_connections'
        ) - (
          SELECT COUNT(*) FROM pg_stat_activity
        ) AS connections_available,
        (
          SELECT COUNT(*) FROM pg_stat_activity
        ) AS open_connections
    )
    SELECT
      'healthy' AS status,
      connections_available,
      open_connections,
      ARRAY(
        SELECT round(latency_ms)::text || 'ms'
        FROM latency_test
      ) AS latency,
      split_part(postgres_version, ' ', 2) AS version
    FROM db_info;
  `;
}
