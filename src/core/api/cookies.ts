type AuthCookies = {
  refresh: string | null;
  session: string | null;
};

const getAuthCookies = (headers: Headers): AuthCookies => {
  const cookieHeader = headers.get("cookie");

  if (!cookieHeader) {
    return {
      refresh: null,
      session: null,
    };
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
