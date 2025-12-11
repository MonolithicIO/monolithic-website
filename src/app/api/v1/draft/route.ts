import { createHandler } from "@core/api/api-handler";
import authMiddleware from "@core/api/middlewares/auth.middleware";
import { NextResponse } from "next/server";

export const POST = createHandler([authMiddleware], async context => {
  return NextResponse.json({ message: "Draft created successfully" });
});
