import MigrationsService from "@services/migrations.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const migrationsService = new MigrationsService();
  const response = await migrationsService.runDryMigrations(req.headers["MigrationToken"]);

  switch (response) {
    case []:
      return NextResponse.json(response, { status: 200 });
    case "failure":
      return NextResponse.json({ error: "Could not conclude migrations" }, { status: 500 });
    case "unauthorized":
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const migrationsService = new MigrationsService();
  const response = await migrationsService.runLiveMigrations(req.headers["MigrationToken"]);

  switch (response) {
    case []:
      return NextResponse.json(response, { status: 200 });
    case "failure":
      return NextResponse.json({ error: "Could not conclude migrations" }, { status: 500 });
    case "unauthorized":
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
