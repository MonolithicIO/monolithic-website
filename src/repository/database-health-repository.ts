import { DatabaseProvider } from "@core/database/database.provider";
import DatabaseHealthModel from "@model/database-health.model";

export default class DatabaseHealthRepository {
  private readonly database: DatabaseProvider;

  constructor() {
    this.database = new DatabaseProvider();
  }

  async getDatabaseHealth(): Promise<DatabaseHealthModel> {
    const queryRows = await this.database.query<any>(DatabaseHealthRepository.statusQuery);
    const response = queryRows[0];

    return Promise.resolve({
      isOnline: response.status,
      connectionsAvailable: response.connections_available,
      openConnections: response.open_connections,
      latency: response.latency,
      version: response.version,
    });
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
