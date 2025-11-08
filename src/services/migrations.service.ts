import MigrationsRepository from "@repository/migrations.repository";

export type MigrationsResult = "success" | "failure" | "unauthorized";

export default class MigrationsService {
  private readonly repository: MigrationsRepository;

  constructor(repository: MigrationsRepository = new MigrationsRepository()) {
    this.repository = repository;
  }

  async runDryMigrations(migrationKey: string): Promise<MigrationsResult> {
    if (!this.validateMigrationKey(migrationKey)) {
      return "unauthorized";
    }

    try {
      await this.repository.runDryMigrations();
      return "success";
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
      await this.repository.runLiveMigrations();
      return "success";
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
