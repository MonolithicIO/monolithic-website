import serverFirebaseApp from "@core/firebase/firebase-server.config";
import { App } from "firebase-admin/app";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import GetUserService from "./get-user.service";
import CreateUserService from "./create-user.service";
import { cookies } from "next/headers";
import LoginResponseModel from "@model/login-response.model";
import { randomUUID } from "node:crypto";

export default class SignInService {
  private readonly admin: App;
  private readonly auth;
  private readonly getUserService: GetUserService;
  private readonly createUserService: CreateUserService;

  constructor(
    admin: App = serverFirebaseApp,
    getUserService: GetUserService = new GetUserService(),
    createUserService: CreateUserService = new CreateUserService()
  ) {
    this.admin = admin;
    this.getUserService = getUserService;
    this.createUserService = createUserService;
    this.auth = getAuth(admin);
  }

  async signIn(token: string): Promise<LoginResponseModel> {
    const verifyToken = await this.auth.verifyIdToken(token);
    this.createUserIfNotExists(verifyToken);
    this.generateSessionCookie(token);

    return {
      sessionUuid: randomUUID(),
    };
  }

  private async createUserIfNotExists(verifyToken: DecodedIdToken): Promise<void> {
    try {
      const user = await this.getUserService.getUserById(verifyToken.uid);

      if (!user) {
        await this.createUserService.createUser({
          uid: verifyToken.uid,
          email: verifyToken.email,
          display_name: verifyToken.name,
          photo_url: verifyToken.picture,
          phone_number: verifyToken.phone_number,
          email_verified: verifyToken.email_verified,
          provider: verifyToken.firebase.sign_in_provider,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    } catch (err) {
      throw new Error("Failed to create user", { cause: err });
    }
  }

  private async generateSessionCookie(token: string) {
    const expiration = 60 * 60 * 1000;
    const sessionCookie = await this.auth.createSessionCookie(token, { expiresIn: expiration });
    const cookieStore = await cookies();

    cookieStore.set("session", sessionCookie, {
      maxAge: expiration,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }
}
