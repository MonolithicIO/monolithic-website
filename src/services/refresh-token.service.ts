import AuthTokenRepository from "@repository/auth-token.repository";
import GetUserService from "./get-user.service";
import CreateSessionService from "./create-session.service";
import { NotFoundError, ValidationError } from "@errors/api.error";
import { DateProvider, DateProviderImpl } from "@core/providers/date.provider";
import dayjs from "dayjs";

type RefreshedSession = {
  sessionCookie: string;
  refreshToken: string;
};

export default class RefreshTokenService {
  private readonly authTokenRepository: AuthTokenRepository;
  private readonly getUserService: GetUserService;
  private readonly createSessionService: CreateSessionService;
  private readonly dateProvider: DateProvider;

  constructor(
    authTokenRepository: AuthTokenRepository = new AuthTokenRepository(),
    getUserService: GetUserService = new GetUserService(),
    createSessionService: CreateSessionService = new CreateSessionService(),
    dateProvider: DateProvider = new DateProviderImpl()
  ) {
    this.authTokenRepository = authTokenRepository;
    this.getUserService = getUserService;
    this.createSessionService = createSessionService;
    this.dateProvider = dateProvider;
  }

  async execute(refreshToken: string): Promise<RefreshedSession> {
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

    const today = this.dateProvider.now();

    const refreshExpiration = dayjs(today).add(7, "day").toDate();

    await this.authTokenRepository.storeRefreshToken(user.id, refreshToken, refreshExpiration);

    return {
      sessionCookie: sessionResponse.jwtToken,
      refreshToken: sessionResponse.refreshToken,
    };
  }
}
