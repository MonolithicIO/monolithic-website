import { createHandler } from "@core/api/api-handler";
import RevokeRefreshTokenService from "@services/revoke-refresh-token.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const DELETE = createHandler([], async _context => {
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
  const revokeRefreshTokenService = new RevokeRefreshTokenService();
  await revokeRefreshTokenService.revoke(refreshToken);

  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("refresh");

  /* 
  https://github.com/vercel/next.js/issues/49005
  Using 200 because NextJS is crashing with 204? shit framework lol
  */
  return NextResponse.json({}, { status: 200 });
});
