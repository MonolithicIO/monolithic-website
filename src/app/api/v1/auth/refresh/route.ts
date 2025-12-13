import { createHandler } from "@core/api/api-handler";
import getAuthCookies from "@core/api/cookies";
import { UnauthorizedError } from "@errors/api.error";
import RefreshTokenService from "@services/auth/refresh-token.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = createHandler([], async _context => {
  const { refresh } = getAuthCookies(_context.request.headers);

  if (!refresh) {
    throw new UnauthorizedError();
  }

  const refreshTokenService = new RefreshTokenService();
  const response = await refreshTokenService.refresh(refresh);
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
