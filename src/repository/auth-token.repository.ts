import { DatabaseProvider } from "@core/database/database.provider";
import { DateProvider, DateProviderImpl } from "@core/providers/date.provider";
import RefreshTokenModel from "@model/refresh-token.model";

export default class AuthTokenRepository {
  private readonly databaseProvider: DatabaseProvider;
  private readonly dateProvider: DateProvider;

  constructor(
    databaseProvider: DatabaseProvider = new DatabaseProvider(),
    dateProvider: DateProvider = new DateProviderImpl()
  ) {
    this.databaseProvider = databaseProvider;
    this.dateProvider = dateProvider;
  }

  async storeRefreshToken(userId: string, refreshToken: string, expiresAt: Date): Promise<void> {
    await this.databaseProvider.query("insert into refresh_tokens (user_id, token, expires_at) values ($1, $2, $3)", [
      userId,
      refreshToken,
      expiresAt,
    ]);
  }

  async getRefreshToken(refreshToken: string): Promise<RefreshTokenModel | null> {
    const result = await this.databaseProvider.query("select * from refresh_tokens where token = $1", [refreshToken]);

    if (!result.length) {
      return null;
    }

    const model: RefreshTokenModel = {
      id: result[0].id,
      userId: result[0].user_id,
      token: result[0].token,
      expiresAt: result[0].expires_at,
      createdAt: result[0].created_at,
      updatedAt: result[0].updated_at,
      isConsumed: result[0].is_consumed,
      isRevoked: result[0].is_revoked,
    };

    return model;
  }

  async revokeToken(refreshToken: string): Promise<void> {
    await this.databaseProvider.query("update refresh_tokens set is_revoked = true where token = $1", [refreshToken]);
  }
}
