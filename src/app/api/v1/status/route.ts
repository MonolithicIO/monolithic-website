import { NextRequest, NextResponse } from "next/server";
import databasePool from "@core/database";
import AppStatusService from "@services/app-status.service";

export async function GET(req: NextRequest) {
  const service = new AppStatusService();
  const response = await service.getAppStatus();

  return NextResponse.json(response, { status: 200 });
}
