import { UnauthorizedError } from "@errors/api.error";
import { MiddlewareFunction } from "./middleware";
import serverFirebaseApp from "@core/firebase/firebase-server.config";

const authMiddleware: MiddlewareFunction = async (context, next) => {
  const cookieHeader = context.request.headers.get("cookie");
  const auth = serverFirebaseApp.auth();

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

  try {
    const decodedAuthToken = await auth.verifySessionCookie(authToken);
    context.userId = decodedAuthToken.uid;
    return await next();
  } catch (error) {
    console.log("Failed to verify session cookie", error);
    throw new UnauthorizedError("Unauthorized", "UNAUTHORIZED", error);
  }
};

export default authMiddleware;
