import { ApiError } from "@errors/api.error";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ErrorResponse {
  message: string;
  errorCode: string;
  statusCode: number;
  timeStamp: string;
  stack?: string;
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: error.issues[0].code,
        errorCode: error.issues[0].message,
        statusCode: 400,
        timeStamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        timeStamp: error.timeStamp.toISOString(),
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred",
        errorCode: "INTERNAL_ERROR",
        statusCode: 500,
        timeStamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "An unexpected error occurred",
      errorCode: "UNKNOWN_ERROR",
      statusCode: 500,
      timeStamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
