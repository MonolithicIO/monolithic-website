import { NextResponse } from "next/server";
import AppStatusService from "@services/app-status.service";
import { createHandler } from "@core/api/api-handler";

export const GET = createHandler([], async context => {
  const service = new AppStatusService();
  const response = await service.getAppStatus();

  return NextResponse.json(response, { status: 200 });
});
