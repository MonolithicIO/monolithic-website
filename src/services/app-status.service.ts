import { AppStatusModel } from "@model/app-status.model";
import DatabaseHealthRepository from "@repository/database-health-repository";
import { ApiError } from "next/dist/server/api-utils";

export default class AppStatusService {
  private readonly databaseRepository: DatabaseHealthRepository;

  async getAppStatus(): Promise<AppStatusModel> {
    const databaseStatus = await this.databaseRepository.getDatabaseHealth();

    return Promise.resolve({
      databaseHealth: databaseStatus,
    });
  }
}
