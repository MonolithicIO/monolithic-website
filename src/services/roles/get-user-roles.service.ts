import UserRoleModel from "@model/user-role.model";
import UserRolesRepository from "@repository/user-roles.repository";

export default class GetUserRolesService {
  private readonly userRolesRepository: UserRolesRepository;

  constructor(userRolesRepository: UserRolesRepository = new UserRolesRepository()) {
    this.userRolesRepository = userRolesRepository;
  }

  getUserRoles(userId: string): Promise<UserRoleModel[]> {
    return this.userRolesRepository.getUserRoles(userId);
  }
}
