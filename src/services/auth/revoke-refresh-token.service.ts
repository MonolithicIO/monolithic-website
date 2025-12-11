import AuthTokenRepository from "@repository/auth-token.repository";

export default class RevokeRefreshTokenService {
  private readonly authTokenRepository: AuthTokenRepository;

  constructor(authTokenRepository: AuthTokenRepository = new AuthTokenRepository()) {
    this.authTokenRepository = authTokenRepository;
  }

  async revoke(refreshToken: string) {
    await this.authTokenRepository.revokeToken(refreshToken);
  }
}
