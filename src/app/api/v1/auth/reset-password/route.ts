import { createHandler } from "@core/api/api-handler";
import { NextResponse } from "next/server";

export const POST = createHandler([], async _context => {
  return NextResponse.json({ hello: "world" });
});
