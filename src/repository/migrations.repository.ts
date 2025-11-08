import { DatabaseProvider } from "@core/database/database.provider";
import { resolve } from "path";
import migrationRunner, { RunnerOption } from "node-pg-migrate";

export default class MigrationsRepository {
  private readonly databaseProvider: DatabaseProvider;

  constructor(databaseProvider: DatabaseProvider = new DatabaseProvider()) {
    this.databaseProvider = databaseProvider;
  }

  async runDryMigrations() {
    const client = await this.databaseProvider.getClient();

    const runnerConfig: RunnerOption = {
      dbClient: client,
      dryRun: true,
      dir: resolve(process.cwd(), "src", "core", "database", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    };
    await migrationRunner(runnerConfig);
    client.release();
  }

  async runLiveMigrations() {
    const client = await this.databaseProvider.getClient();

    const runnerConfig: RunnerOption = {
      dbClient: client,
      dryRun: false,
      dir: resolve(process.cwd(), "src", "core", "database", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    };
    await migrationRunner(runnerConfig);
    client.release();
  }
}
