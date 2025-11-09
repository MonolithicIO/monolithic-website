import ConcludedMigration from "@model/concluded-migration";
import { IMigrationsRepository } from "@repository/migrations.repository";
import { error } from "console";

export default class MigrationsRepositoryMock implements IMigrationsRepository {
  dryResponse: ConcludedMigration[] | Error;
  liveResponse: ConcludedMigration[] | Error;

  runDryMigrations(): Promise<ConcludedMigration[]> {
    if (this.dryResponse instanceof Error) {
      throw error;
    }
    return Promise.resolve(this.dryResponse);
  }
  runLiveMigrations(): Promise<ConcludedMigration[]> {
    if (this.liveResponse instanceof Error) {
      throw error;
    }
    return Promise.resolve(this.liveResponse);
  }
}
