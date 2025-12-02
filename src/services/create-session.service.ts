import JwtSigner from "@core/jwt/JwtSigner";
import UserModel from "@model/user.model";
import UuidProvider from "@core/providers/uuid.provider";
import GetUserRolesService from "./get-user-roles.service";

type CookieResponse = {
  jwtToken: string;
  refreshToken: string;
};

export default class CreateSessionService {
  private readonly jwtSigner: JwtSigner;
  private readonly getUserRolesService: GetUserRolesService;
  private readonly uuidProvider: UuidProvider;

  constructor(
    jwtSigner: JwtSigner = new JwtSigner(),
    getUserRolesService: GetUserRolesService = new GetUserRolesService(),
    uuidProvider: UuidProvider = new UuidProvider()
  ) {
    this.jwtSigner = jwtSigner;
    this.getUserRolesService = getUserRolesService;
    this.uuidProvider = uuidProvider;
  }

  async createUserSession(user: UserModel): Promise<CookieResponse> {
    const roles = await this.getUserRolesService.getUserRoles(user.id);
    const cookieUuid = this.uuidProvider.generate();

    const jwtToken = this.jwtSigner.signToken({
      userId: user.id,
      roles: roles,
      id: cookieUuid,
    });
    const refreshToken = this.uuidProvider.generate();

    return {
      jwtToken,
      refreshToken,
    };
  }
}
