import { createHandler } from "@core/api/api-handler";
import RefreshTokenService from "@services/refresh-token.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { refreshLoginSchema } from "src/schemas/refresh-login.schema";

export const POST = createHandler([], async _context => {
  const body = await _context.request.json();
  const { refreshToken } = refreshLoginSchema.parse(body);

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
