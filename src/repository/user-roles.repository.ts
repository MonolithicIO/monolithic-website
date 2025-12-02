import { DatabaseProvider } from "@core/database/database.provider";
import UserRoleModel from "@model/user-role.model";

export default class UserRolesRepository {
  private readonly databaseProvider: DatabaseProvider;

  constructor(databaseProvider: DatabaseProvider = new DatabaseProvider()) {
    this.databaseProvider = databaseProvider;
  }

  async getUserRoles(userId: string): Promise<UserRoleModel[]> {
    const response = await this.databaseProvider.query("SELECT * FROM user_roles WHERE user_id = $1", [userId]);

    const mappedRows = response.map(row => row.role_id as UserRoleModel).filter(role => role !== undefined);

    return mappedRows;
  }
}
