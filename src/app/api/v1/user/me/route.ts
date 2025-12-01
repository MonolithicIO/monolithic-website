import { createHandler } from "@core/api/api-handler";
import authMiddleware from "@core/api/middlewares/auth.middleware";
import { NextResponse } from "next/server";

export const GET = createHandler([authMiddleware], async _context => {
  return NextResponse.json({ message: "Hello, World!" }, { status: 200 });
});
