import DatabaseHealthModel from "./database-health.model";

export interface AppStatusModel {
  updatedAt: Date;
  databaseHealth: DatabaseHealthModel | null;
}
