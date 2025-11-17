import { DateProvider, DateProviderImpl } from "@core/providers/date.provider";
import { AppStatusModel } from "@model/app-status.model";
import DatabaseHealthModel from "@model/database-health.model";
import { DatabaseHealthRepository, DatabaseHealthRepositoryImpl } from "@repository/database-health.repository";

export default class AppStatusService {
  private readonly databaseRepository: DatabaseHealthRepository;
  private readonly dateProvider: DateProvider;

  constructor(
    databaseRepository: DatabaseHealthRepository = new DatabaseHealthRepositoryImpl(),
    dateProvider: DateProvider = new DateProviderImpl()
  ) {
    this.databaseRepository = databaseRepository;
    this.dateProvider = dateProvider;
  }

  async getAppStatus(): Promise<AppStatusModel> {
    const databaseStatus = await this.getDatabaseHealth();

    return {
      databaseHealth: databaseStatus,
      updatedAt: this.dateProvider.now(),
    };
  }

  private async getDatabaseHealth(): Promise<DatabaseHealthModel> {
    try {
      return await this.databaseRepository.getDatabaseHealth();
    } catch (err) {
      console.log(err);
      return {
        isOnline: false,
        connectionsAvailable: "n/a",
        openConnections: "n/a",
        latency: ["9999ms", "9999ms", "9999ms"],
        version: "n/a",
      };
    }
  }
}
