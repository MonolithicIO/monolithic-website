import serverFirebaseApp from "@core/firebase/firebase-server.config";
import { App } from "firebase-admin/app";
import { Auth, DecodedIdToken, getAuth } from "firebase-admin/auth";
import GetUserService from "./get-user.service";
import CreateUserService from "./create-user.service";
import LoginResponseModel from "@model/login-response.model";
import { UnauthorizedError } from "@errors/api.error";
import UserModel from "@model/user.model";

export default class SignInService {
  private readonly auth: Auth;
  private readonly getUserService: GetUserService;
  private readonly createUserService: CreateUserService;

  constructor(
    admin: App = serverFirebaseApp,
    getUserService: GetUserService = new GetUserService(),
    createUserService: CreateUserService = new CreateUserService()
  ) {
    this.getUserService = getUserService;
    this.createUserService = createUserService;
    this.auth = getAuth(admin);
  }

  async signIn(token: string): Promise<LoginResponseModel> {
    const verifyToken = await this.verifyToken(token);
    const user = await this.createUserIfNotExists(verifyToken);

    return {
      sessionCookie: await this.generateSessionCookie(token),
      userName: user.display_name,
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

  private async generateSessionCookie(token: string): Promise<string> {
    const expiration = 60 * 60 * 1000;
    return await this.auth.createSessionCookie(token, { expiresIn: expiration });
  }

  private async verifyToken(token: string): Promise<DecodedIdToken> {
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
