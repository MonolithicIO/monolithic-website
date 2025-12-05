import { createHandler } from "@core/api/api-handler";
import { UnauthorizedError } from "@errors/api.error";
import RefreshTokenService from "@services/refresh-token.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = createHandler([], async _context => {
  const cookieHeader = _context.request.headers.get("cookie");

  const requestCookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  const refreshToken = requestCookies["refresh"];

  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  const refreshTokenService = new RefreshTokenService();
  const response = await refreshTokenService.refresh(refreshToken);
  const cookiesStore = await cookies();

  cookiesStore.set({
    name: "session",
    value: response.sessionCookie,
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  cookiesStore.set({
    name: "refresh",
    value: response.refreshToken,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return NextResponse.json({});
});
