import { DatabaseProvider } from "@core/database/database.provider";
import { NextRequest, NextResponse } from "next/server";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { join } from "path";

export async function GET(req: NextRequest) {
  const databaseProvider = new DatabaseProvider();
  const client = await databaseProvider.getClient();

  try {
    const runnerConfig: RunnerOption = {
      dbClient: client,
      dryRun: true,
      dir: join("src", "core", "database", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    };
    const result = await migrationRunner(runnerConfig);
    client.release();

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const databaseProvider = new DatabaseProvider();
  const client = await databaseProvider.getClient();

  try {
    const runnerConfig: RunnerOption = {
      dbClient: client,
      dryRun: false,
      dir: join("src", "core", "database", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    };
    const result = await migrationRunner(runnerConfig);
    client.release();

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
