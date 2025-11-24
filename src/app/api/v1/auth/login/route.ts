import { createHandler } from "@core/api/api-handler";
import authMiddleware from "@core/api/middlewares/auth.middleware";
import SignInService from "@services/sign-in.service";
import { NextResponse } from "next/server";

export const POST = createHandler([authMiddleware], async context => {
  const authToken = context.authToken;
  const loginService = new SignInService();
  const response = await loginService.signIn(authToken);
  return NextResponse.json(response, { status: 201 });
});
