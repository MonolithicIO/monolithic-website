import { createHandler } from "@core/api/api-handler";
import SignInService from "@services/auth/sign-in.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginSchema } from "src/schemas/login.schema";

export const POST = createHandler([], async context => {
  const body = await context.request.json();
  const { authToken } = loginSchema.parse(body);

  const loginService = new SignInService();
  const response = await loginService.signIn(authToken);
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

  return NextResponse.json({}, { status: 201 });
});
