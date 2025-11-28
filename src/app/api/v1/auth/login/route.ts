import { createHandler } from "@core/api/api-handler";
import SignInService from "@services/sign-in.service";
import { NextResponse } from "next/server";
import { loginSchema } from "src/schemas/login.schema";

export const POST = createHandler([], async context => {
  const body = await context.request.json();
  const { authToken } = loginSchema.parse(body);

  const loginService = new SignInService();
  const response = await loginService.signIn(authToken);
  return NextResponse.json(response, { status: 201 });
});
