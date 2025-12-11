import JwtSigner from "@core/jwt/JwtSigner";
import UserModel from "@model/user.model";
import UuidProvider from "@core/providers/uuid.provider";
import GetUserRolesService from "../roles/get-user-roles.service";

type SessionResponse = {
  jwtToken: string;
  refreshToken: string;
  roles: string[];
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

  async createUserSession(user: UserModel): Promise<SessionResponse> {
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
      roles,
    };
  }
}
