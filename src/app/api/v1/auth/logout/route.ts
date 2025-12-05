import { createHandler } from "@core/api/api-handler";
import RevokeRefreshTokenService from "@services/revoke-refresh-token.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import getAuthCookies from "@core/api/cookies";

export const DELETE = createHandler([], async _context => {
  const { refresh } = getAuthCookies(_context.request.headers);

  const revokeRefreshTokenService = new RevokeRefreshTokenService();
  await revokeRefreshTokenService.revoke(refresh);

  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("refresh");

  /* 
  https://github.com/vercel/next.js/issues/49005
  Using 200 because NextJS is crashing with 204? shit framework lol
  */
  return NextResponse.json({}, { status: 200 });
});
