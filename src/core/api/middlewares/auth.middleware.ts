import { UnauthorizedError } from "@errors/api.error";
import { MiddlewareFunction } from "./middleware";

const authMiddleware: MiddlewareFunction = async (context, next) => {
  const authHeader = context.request.headers.get("Authorization");

  if (!authHeader) {
    throw new UnauthorizedError();
  }

  context.authToken = authHeader.split("Bearer ")[1];

  return await next();
};

export default authMiddleware;
