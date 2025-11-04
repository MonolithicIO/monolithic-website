import DatabaseHealthModel from "./database-health.model";

export interface AppStatusModel {
  databaseHealth: DatabaseHealthModel;
}
