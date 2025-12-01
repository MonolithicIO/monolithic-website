import { createHandler } from "@core/api/api-handler";
import authMiddleware from "@core/api/middlewares/auth.middleware";
import GetUserService from "@services/get-user.service";
import { NextResponse } from "next/server";

export const GET = createHandler([authMiddleware], async _context => {
  const userService = new GetUserService();

  const { userId } = _context;
  const user = await userService.getUserById(userId);

  return NextResponse.json({ user }, { status: 200 });
});
