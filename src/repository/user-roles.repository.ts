import { DatabaseProvider } from "@core/database/database.provider";
import UserRoleModel, { mapNumberToUserRole } from "@model/user-role.model";

export default class UserRolesRepository {
  private readonly databaseProvider: DatabaseProvider;

  constructor(databaseProvider: DatabaseProvider = new DatabaseProvider()) {
    this.databaseProvider = databaseProvider;
  }

  async getUserRoles(userId: string): Promise<UserRoleModel[]> {
    const response = await this.databaseProvider.query("SELECT role_id FROM user_roles WHERE user_id = $1", [userId]);

    const mappedRoles = response
      .map(row => {
        const roleId = row.role_id as number;
        return mapNumberToUserRole(roleId);
      })
      .filter(role => role !== undefined);

    return mappedRoles;
  }
}
