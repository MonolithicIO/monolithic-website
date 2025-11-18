import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@core/api/error-handler";
import { MiddlewareContext, MiddlewareFunction, RouteHandler } from "@core/api/middlewares/middleware";

export function createHandler(middlewares: MiddlewareFunction[], handler: RouteHandler) {
  return async (request: NextRequest, routeParams?: any) => {
    try {
      const context: MiddlewareContext = {
        request,
        params: routeParams?.params || routeParams,
      };

      let currentIndex = 0;

      const next = async (): Promise<void> => {
        if (currentIndex >= middlewares.length) {
          return;
        }

        const middleware = middlewares[currentIndex];
        currentIndex++;

        const result = await middleware(context, next);

        if (result instanceof NextResponse) {
          throw result;
        }
      };

      await next();

      return await handler(context);
    } catch (error) {
      if (error instanceof NextResponse) {
        return error;
      }

      return handleApiError(error);
    }
  };
}
