import { DateProvider, DateProviderImpl } from "@core/providers/date.provider";
import { AppStatusModel } from "@model/app-status.model";
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
    const databaseStatus = await this.databaseRepository.getDatabaseHealth();

    return Promise.resolve({
      databaseHealth: databaseStatus,
      updatedAt: this.dateProvider.now(),
    });
  }
}
