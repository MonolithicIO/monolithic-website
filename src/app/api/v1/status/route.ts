import { NextResponse } from "next/server";
import AppStatusService from "@services/app-status.service";

export async function GET() {
  const service = new AppStatusService();
  const response = await service.getAppStatus();

  return NextResponse.json(response, { status: 200 });
}
