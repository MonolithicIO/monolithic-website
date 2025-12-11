import { createHandler } from "@core/api/api-handler";
import authMiddleware from "@core/api/middlewares/auth.middleware";
import GetCurrentUserService from "@services/user/get-current-user.service";
import { NextResponse } from "next/server";

export const GET = createHandler([authMiddleware], async _context => {
  const userService = new GetCurrentUserService();

  const { userId } = _context;
  const user = await userService.getCurrentUser(userId);

  return NextResponse.json(
    {
      displayName: user.displayName,
      photoUrl: user.photoUrl,
      email: user.email,
      roles: user.roles,
    },
    { status: 200 }
  );
});
