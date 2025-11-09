import DatabaseHealthModel from "@model/database-health.model";
import { DatabaseHealthRepository } from "@repository/database-health.repository";

export default class DatabaseHealthRepositoryMock implements DatabaseHealthRepository {
  response: DatabaseHealthModel | Error;

  getDatabaseHealth(): Promise<DatabaseHealthModel> {
    if (this.response instanceof Error) {
      return Promise.reject(this.response);
    }
    return Promise.resolve(this.response);
  }
}
