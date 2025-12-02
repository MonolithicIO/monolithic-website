import { sign, SignOptions, verify } from "jsonwebtoken";

type JwtSignerProps = {
  userId: string;
  roles: string[];
};

class JwtSigner {
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

  decode(token: string): JwtSignerProps | null {
    try {
      return verify(token, process.env.JWT_SECRET) as JwtSignerProps;
    } catch {
      return null;
    }
  }
}
