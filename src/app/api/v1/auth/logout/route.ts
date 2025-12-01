import { createHandler } from "@core/api/api-handler";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const DELETE = createHandler([], async _context => {
  const cookieStore = await cookies();

  cookieStore.delete("session");

  /* 
  https://github.com/vercel/next.js/issues/49005
  Using 200 because NextJS is crashing with 204? shit framework lol
  */
  return NextResponse.json({}, { status: 200 });
});
