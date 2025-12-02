import serverFirebaseApp from "@core/firebase/firebase-server.config";
import { App } from "firebase-admin/app";
import { Auth, DecodedIdToken, getAuth } from "firebase-admin/auth";
import GetUserService from "./get-user.service";
import CreateUserService from "./create-user.service";
import LoginResponseModel from "@model/login-response.model";
import { UnauthorizedError } from "@errors/api.error";
import UserModel from "@model/user.model";
import JwtSigner from "@core/jwt/JwtSigner";
import GetUserRolesService from "./get-user-roles.service";
import UuidProvider from "@core/providers/uuid.provider";

type CookieResponse = {
  jwtToken: string;
  refreshToken: string;
};

export default class SignInService {
  private readonly auth: Auth;
  private readonly jwtSigner: JwtSigner;
  private readonly getUserService: GetUserService;
  private readonly createUserService: CreateUserService;
  private readonly getUserRolesService: GetUserRolesService;
  private readonly uuidProvider: UuidProvider;

  constructor(
    admin: App = serverFirebaseApp,
    getUserService: GetUserService = new GetUserService(),
    createUserService: CreateUserService = new CreateUserService(),
    uuidProvider: UuidProvider = new UuidProvider(),
    jwtSigner: JwtSigner = new JwtSigner(),
    getUserRolesService: GetUserRolesService = new GetUserRolesService()
  ) {
    this.getUserService = getUserService;
    this.createUserService = createUserService;
    this.auth = getAuth(admin);
    this.uuidProvider = uuidProvider;
    this.jwtSigner = jwtSigner;
    this.getUserRolesService = getUserRolesService;
  }

  async signIn(token: string): Promise<LoginResponseModel> {
    const firebaseId = await this.verifyFirebaseToken(token);
    const user = await this.createUserIfNotExists(firebaseId);
    const cookieResponse = await this.generateSessionCookie(user);

    return {
      sessionCookie: cookieResponse.jwtToken,
      refreshToken: cookieResponse.refreshToken,
      userModel: user,
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

  private async generateSessionCookie(user: UserModel): Promise<CookieResponse> {
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
