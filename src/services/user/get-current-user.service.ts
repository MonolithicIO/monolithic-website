import { getRoleString } from "@model/user-role.model";
import UserRolesRepository from "@repository/user-roles.repository";
import UserRepository from "@repository/user.repository";

type CurrentUser = {
  displayName: string;
  photoUrl: string | null;
  email: string;
  roles: string[];
};

export default class GetCurrentUserService {
  private readonly userRepository: UserRepository;
  private readonly userRolesRepository: UserRolesRepository;

  constructor(
    userRepository: UserRepository = new UserRepository(),
    userRolesRepository: UserRolesRepository = new UserRolesRepository()
  ) {
    this.userRepository = userRepository;
    this.userRolesRepository = userRolesRepository;
  }

  async getCurrentUser(userId: string): Promise<CurrentUser> {
    const user = await this.userRepository.getUserById(userId);
    const roles = await this.userRolesRepository.getUserRoles(userId);

    return {
      displayName: user.display_name,
      photoUrl: user.photo_url,
      email: user.email,
      roles: roles.map(role => getRoleString(role)),
    };
  }
}
