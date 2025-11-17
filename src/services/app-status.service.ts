import { AppStatusModel } from "@model/app-status.model";
import { DatabaseHealthRepository, DatabaseHealthRepositoryImpl } from "@repository/database-health.repository";

export default class AppStatusService {
  private readonly databaseRepository: DatabaseHealthRepository;

  constructor(databaseRepository: DatabaseHealthRepository = new DatabaseHealthRepositoryImpl()) {
    this.databaseRepository = databaseRepository;
  }

  async getAppStatus(): Promise<AppStatusModel> {
    const databaseStatus = await this.databaseRepository.getDatabaseHealth();

    return Promise.resolve({
      databaseHealth: databaseStatus,
      updatedAt: new Date(),
    });
  }
}
