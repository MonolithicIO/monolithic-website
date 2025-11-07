import { DatabaseProvider } from "@core/database/database.provider";
import { NextRequest, NextResponse } from "next/server";
import migrationRunner, { RunnerOption } from "node-pg-migrate";

import { join } from "path";

export async function GET(req: NextRequest) {
  const runnerConfig: RunnerOption = {
    databaseUrl: process.env.DATABASE_URL,
    // dbClient: new DatabaseProvider().getClient(),
    dryRun: true,
    dir: join("src", "core", "database", "migrations"),
    migrationsTable: "pgmigrations",
    direction: "up",
  };
  const result = await migrationRunner(runnerConfig);

  return NextResponse.json(result, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
