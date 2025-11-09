import { DatabaseProvider } from "@core/database/database.provider";
import { resolve } from "path";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import ConcludedMigration from "@model/concluded-migration";

export interface MigrationsRepository {
  runDryMigrations(): Promise<ConcludedMigration[]>;
  runLiveMigrations(): Promise<ConcludedMigration[]>;
}

export class MigrationsRepositoryImpl implements MigrationsRepository {
  private readonly databaseProvider: DatabaseProvider;

  constructor(databaseProvider: DatabaseProvider = new DatabaseProvider()) {
    this.databaseProvider = databaseProvider;
  }

  async runDryMigrations(): Promise<ConcludedMigration[]> {
    const client = await this.databaseProvider.getClient();

    const runnerConfig: RunnerOption = {
      dbClient: client,
      dryRun: true,
      dir: resolve(process.cwd(), "src", "core", "database", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    };
    const response = await migrationRunner(runnerConfig);
    client.release();
    return response;
  }

  async runLiveMigrations(): Promise<ConcludedMigration[]> {
    const client = await this.databaseProvider.getClient();

    const runnerConfig: RunnerOption = {
      dbClient: client,
      dryRun: false,
      dir: resolve(process.cwd(), "src", "core", "database", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    };
    const response = await migrationRunner(runnerConfig);
    client.release();
    return response;
  }
}
