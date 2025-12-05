import { DateProvider, DateProviderImpl } from "@core/providers/date.provider";
import AuthTokenRepository from "@repository/auth-token.repository";
import dayjs from "dayjs";

export default class StoreRefreshTokenService {
  private readonly dateProvider: DateProvider;
  private readonly authTokenRepository: AuthTokenRepository;

  constructor(dateProvider: DateProvider = new DateProviderImpl(), authTokenRepository = new AuthTokenRepository()) {
    this.dateProvider = dateProvider;
    this.authTokenRepository = authTokenRepository;
  }

  async store(userId: string, refreshToken: string) {
    const today = this.dateProvider.now();

    const refreshExpiration = dayjs(today).add(7, "day").toDate();

    await this.authTokenRepository.storeRefreshToken(userId, refreshToken, refreshExpiration);
  }
}
