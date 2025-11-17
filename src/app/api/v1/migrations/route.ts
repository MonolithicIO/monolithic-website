import { createHandler } from "@core/api/api-handler";
import MigrationsService from "@services/migrations.service";
import { NextResponse } from "next/server";

export const GET = createHandler([], async context => {
  const migrationsService = new MigrationsService();
  const response = await migrationsService.runDryMigrations(context.request.headers.get("MigrationToken"));

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
});

export const POST = createHandler([], async context => {
  const migrationsService = new MigrationsService();
  const response = await migrationsService.runLiveMigrations(context.request.headers.get("MigrationToken"));

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
});
