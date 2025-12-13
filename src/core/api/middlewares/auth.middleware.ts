import { UnauthorizedError } from "@errors/api.error";
import { MiddlewareFunction } from "./middleware";
import JwtSigner from "@core/jwt/JwtSigner";
import getAuthCookies from "../cookies";
import { mapStringToUserRole } from "@model/user-role.model";

const authMiddleware: MiddlewareFunction = async (context, next) => {
  const { session } = getAuthCookies(context.request.headers);
  const jwtSigner = new JwtSigner();

  if (!session) {
    throw new UnauthorizedError("Unauthorized", "UNAUTHORIZED");
  }

  const decodedAuthToken = jwtSigner.decode(session);

  if (decodedAuthToken === "expired") {
    throw new UnauthorizedError("Unauthorized", "EXPIRED");
  }

  if (decodedAuthToken === "invalid") {
    throw new UnauthorizedError("Unauthorized", "INVALID");
  }

  context.userId = decodedAuthToken.userId;
  context.roles = decodedAuthToken.roles.map(role => mapStringToUserRole(role));
  return await next();
};

export default authMiddleware;
