import UserRolesRepository from "@repository/user-roles.repository";

export default class GetUserRolesService {
  private readonly userRolesRepository: UserRolesRepository;

  constructor(userRolesRepository: UserRolesRepository = new UserRolesRepository()) {
    this.userRolesRepository = userRolesRepository;
  }

  getUserRoles(userId: string): Promise<string[]> {
    return this.userRolesRepository.getUserRoles(userId);
  }
}
