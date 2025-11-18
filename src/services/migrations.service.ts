import ConcludedMigration from "@model/concluded-migration.model";
import { MigrationsRepository, MigrationsRepositoryImpl } from "@repository/migrations.repository";

export type MigrationsResult = ConcludedMigration[] | "failure" | "unauthorized";

export default class MigrationsService {
  private readonly repository: MigrationsRepository;

  constructor(repository: MigrationsRepository = new MigrationsRepositoryImpl()) {
    this.repository = repository;
  }

  async runDryMigrations(migrationKey: string): Promise<MigrationsResult> {
    if (!this.validateMigrationKey(migrationKey)) {
      return "unauthorized";
    }

    try {
      return await this.repository.runDryMigrations();
    } catch (err) {
      this.logMigrationError(err);
      return "failure";
    }
  }

  async runLiveMigrations(migrationKey: string): Promise<MigrationsResult> {
    if (!this.validateMigrationKey(migrationKey)) {
      return "unauthorized";
    }

    try {
      return await this.repository.runLiveMigrations();
    } catch (err) {
      this.logMigrationError(err);
      return "failure";
    }
  }

  private validateMigrationKey(key: string): boolean {
    if (process.env.NODE_ENV === "production") {
      if (key !== process.env.MIGRATIONS_KEY) {
        return false;
      }
    }

    return true;
  }

  private logMigrationError(err: any) {
    if (err instanceof Error) {
      console.log(`Failed to live run migrations: ${err.message}`);
    }
  }
}
