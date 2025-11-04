import { NextRequest, NextResponse } from "next/server";
import databasePool from "../../../../core/database";

export async function GET(req: NextRequest) {
  return NextResponse.json({ databaseHealth: checkDatabaseHealth }, { status: 200 });
}

async function checkDatabaseHealth(): Promise<boolean> {
  const database = databasePool;

  try {
    const testQuery = await database.query("Select $1::text as message", ["Hello world"]);
    return testQuery.rows.length > 0;
  } catch {
    return false;
  }
}
