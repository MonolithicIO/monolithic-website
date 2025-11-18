import { NextRequest, NextResponse } from "next/server";

export interface MiddlewareContext {
  request: NextRequest;
  params?: any;
  [key: string]: any;
}

export type NextFunction = () => Promise<void>;

export type MiddlewareFunction = (context: MiddlewareContext, next: NextFunction) => Promise<void | NextResponse>;

export type RouteHandler = (context: MiddlewareContext) => Promise<NextResponse> | NextResponse;
