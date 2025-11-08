import MigrationsService from "@services/migrations.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const migrationsService = new MigrationsService();
  const response = await migrationsService.runDryMigrations(req.headers.get("MigrationToken"));

  if (Array.isArray(response)) {
    return NextResponse.json({
      message: `${response.length} migrations executed successfully`,
      migrations: response,
    });
  }
  switch (response) {
    case "failure":
      return NextResponse.json({ error: "Could not conclude migrations" }, { status: 500 });
    case "unauthorized":
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const migrationsService = new MigrationsService();
  const response = await migrationsService.runLiveMigrations(req.headers.get("MigrationToken"));

  if (Array.isArray(response)) {
    return NextResponse.json({
      message: `${response.length} migrations executed successfully`,
      migrations: response,
    });
  }
  switch (response) {
    case "failure":
      return NextResponse.json({ error: "Could not conclude migrations" }, { status: 500 });
    case "unauthorized":
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
