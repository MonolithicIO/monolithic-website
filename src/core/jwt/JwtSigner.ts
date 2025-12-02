import UserRoleModel from "@model/user-role.model";
import { sign, SignOptions, TokenExpiredError, verify } from "jsonwebtoken";

export type JwtSignerProps = {
  id: string;
  userId: string;
  roles: UserRoleModel[];
};

export type JwtSignerDecodedProps = JwtSignerProps | "expired" | "invalid";

export default class JwtSigner {
  signToken(props: JwtSignerProps): string {
    const options: SignOptions = {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUTH_AUDIENCE,
      subject: process.env.JWT_AUTH_SUBJECT,
      algorithm: "HS256",
      expiresIn: "5min",
    };

    return sign(props, process.env.JWT_SECRET, options);
  }

  decode(token: string): JwtSignerDecodedProps {
    try {
      return verify(token, process.env.JWT_SECRET) as JwtSignerProps;
    } catch (err) {
      if (err instanceof TokenExpiredError) return "expired";
      return "invalid";
    }
  }
}
