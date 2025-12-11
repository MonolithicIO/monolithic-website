import UserRoleModel from "@model/user-role.model";
import { NextRequest, NextResponse } from "next/server";

export interface MiddlewareContext {
  request: NextRequest;
  params?: any;
  userId?: string;
  roles?: UserRoleModel[];
  [key: string]: any;
}

export type NextFunction = () => Promise<void>;

export type MiddlewareFunction = (_context: MiddlewareContext, _next: NextFunction) => Promise<void | NextResponse>;

export type RouteHandler = (_context: MiddlewareContext) => Promise<NextResponse> | NextResponse;
