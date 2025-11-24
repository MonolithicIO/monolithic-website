import DatabaseHealthModel from "./database-health.model";

type AppStatusModel = {
  updatedAt: Date;
  databaseHealth: DatabaseHealthModel | null;
};

export default AppStatusModel;
