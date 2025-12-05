import { UnauthorizedError } from "@errors/api.error";

type AuthCookies = {
  refresh: string;
  session: string;
};

const getAuthCookies = (headers: Headers): AuthCookies => {
  const cookieHeader = headers.get("cookie");

  if (!cookieHeader) {
    throw new UnauthorizedError("Unauthorized", "UNAUTHORIZED");
  }

  const requestCookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    refresh: requestCookies["refresh"],
    session: requestCookies["session"],
  };
};

export default getAuthCookies;
