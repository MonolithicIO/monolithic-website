import AuthTokenRepository from "@repository/auth-token.repository";
import GetUserService from "@services/user/get-user.service";
import CreateSessionService from "@services/auth/create-session.service";
import { NotFoundError, ValidationError } from "@errors/api.error";
import StoreRefreshTokenService from "@services/auth/store-refresh-token.service";

type RefreshedSession = {
  sessionCookie: string;
  refreshToken: string;
};

export default class RefreshTokenService {
  private readonly authTokenRepository: AuthTokenRepository;
  private readonly getUserService: GetUserService;
  private readonly createSessionService: CreateSessionService;
  private readonly storeRefreshTokenService: StoreRefreshTokenService;

  constructor(
    authTokenRepository: AuthTokenRepository = new AuthTokenRepository(),
    getUserService: GetUserService = new GetUserService(),
    createSessionService: CreateSessionService = new CreateSessionService(),
    storeRefreshTokenService = new StoreRefreshTokenService()
  ) {
    this.authTokenRepository = authTokenRepository;
    this.getUserService = getUserService;
    this.createSessionService = createSessionService;
    this.storeRefreshTokenService = storeRefreshTokenService;
  }

  async refresh(refreshToken: string): Promise<RefreshedSession> {
    const token = await this.authTokenRepository.getRefreshToken(refreshToken);

    if (!token) {
      throw new ValidationError("Invalid refresh token");
    }
    if (token.isConsumed || token.isRevoked) {
      throw new ValidationError("Refresh token already consumed or revoked");
    }

    const user = await this.getUserService.getUserById(token.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const sessionResponse = await this.createSessionService.createUserSession(user);
    await this.authTokenRepository.revokeToken(refreshToken);

    await this.storeRefreshTokenService.store(user.id, sessionResponse.refreshToken);

    return {
      sessionCookie: sessionResponse.jwtToken,
      refreshToken: sessionResponse.refreshToken,
    };
  }
}
