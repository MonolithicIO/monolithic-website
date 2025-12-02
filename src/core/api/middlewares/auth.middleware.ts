import { UnauthorizedError } from "@errors/api.error";
import { MiddlewareFunction } from "./middleware";
import serverFirebaseApp from "@core/firebase/firebase-server.config";
import JwtSigner from "@core/jwt/JwtSigner";

const authMiddleware: MiddlewareFunction = async (context, next) => {
  const cookieHeader = context.request.headers.get("cookie");
  const jwtSigner = new JwtSigner();

  if (!cookieHeader) {
    throw new UnauthorizedError("Unauthorized", "UNAUTHORIZED");
  }

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  const authToken = cookies["session"];

  if (!authToken) {
    throw new UnauthorizedError();
  }

  const decodedAuthToken = jwtSigner.decode(authToken);

  if (decodedAuthToken === "expired") {
    throw new UnauthorizedError("Unauthorized", "EXPIRED");
  }

  if (decodedAuthToken === "invalid") {
    throw new UnauthorizedError("Unauthorized", "INVALID");
  }

  context.userId = decodedAuthToken.userId;
  context.roles = decodedAuthToken.roles;
  return await next();
};

export default authMiddleware;
