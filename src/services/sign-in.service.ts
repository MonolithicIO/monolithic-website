import serverFirebaseApp from "@core/firebase/firebase-server.config";
import { App } from "firebase-admin/app";
import { Auth, DecodedIdToken, getAuth } from "firebase-admin/auth";
import GetUserService from "./get-user.service";
import CreateUserService from "./create-user.service";
import { UnauthorizedError } from "@errors/api.error";
import UserModel from "@model/user.model";
import CreateSessionService from "./create-session.service";
import StoreRefreshTokenService from "./store-refresh-token.service";

type SignedUserModel = {
  sessionCookie: string;
  refreshToken: string;
};

export default class SignInService {
  private readonly auth: Auth;
  private readonly getUserService: GetUserService;
  private readonly createUserService: CreateUserService;
  private readonly createSessionService: CreateSessionService;
  private readonly storeRefreshTokenService: StoreRefreshTokenService;

  constructor(
    admin: App = serverFirebaseApp,
    getUserService: GetUserService = new GetUserService(),
    createUserService: CreateUserService = new CreateUserService(),
    createSessionService: CreateSessionService = new CreateSessionService(),
    storeRefreshTokenService: StoreRefreshTokenService = new StoreRefreshTokenService()
  ) {
    this.getUserService = getUserService;
    this.createUserService = createUserService;
    this.auth = getAuth(admin);
    this.createSessionService = createSessionService;
    this.storeRefreshTokenService = storeRefreshTokenService;
  }

  async signIn(token: string): Promise<SignedUserModel> {
    const firebaseId = await this.verifyFirebaseToken(token);
    const user = await this.createUserIfNotExists(firebaseId);
    const sessionResponse = await this.createSessionService.createUserSession(user);

    await this.storeRefreshTokenService.store(user.id, sessionResponse.refreshToken);

    return {
      sessionCookie: sessionResponse.jwtToken,
      refreshToken: sessionResponse.refreshToken,
    };
  }

  private async createUserIfNotExists(verifyToken: DecodedIdToken): Promise<UserModel> {
    try {
      const user = await this.getUserService.getUserById(verifyToken.uid);

      if (!user) {
        const newUser = await this.createUserService.createUser({
          uid: verifyToken.uid,
          email: verifyToken.email,
          display_name: verifyToken.name ?? verifyToken.email,
          photo_url: verifyToken.picture,
          phone_number: verifyToken.phone_number,
          email_verified: verifyToken.email_verified,
          provider: verifyToken.firebase.sign_in_provider,
          created_at: new Date(),
          updated_at: new Date(),
        });
        return newUser;
      }

      return user;
    } catch (err) {
      throw new Error("Failed to create user", { cause: err });
    }
  }

  private async verifyFirebaseToken(token: string): Promise<DecodedIdToken> {
    try {
      const decodedToken = await this.auth.verifyIdToken(token, true);
      return decodedToken;
    } catch (err) {
      console.log(err);
      if (err.message === "auth-id-token-expired") {
        throw new UnauthorizedError("Token expired", "TOKEN_EXPIRED", err);
      }
      if (err.message === "auth/id-token-revoked") {
        throw new UnauthorizedError("Token revoked", "TOKEN_REVOKED", err);
      }
      throw new UnauthorizedError("Failed to verify token", "TOKEN_VERIFICATION_FAILED", err);
    }
  }
}
