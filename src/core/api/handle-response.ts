import { ErrorResponse } from "./error-handler";

const handleResponse = async <T>(response: Response): Promise<T | ErrorResponse> => {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorResponse: ErrorResponse = {
      message: body?.message || response.statusText || "An error occurred",
      errorCode: body?.errorCode || "",
      statusCode: response.status,
      timeStamp: body?.timeStamp || new Date().toISOString(),
      stack: body.stack || null,
    };

    return errorResponse;
  }

  return body as T;
};

export default handleResponse;
