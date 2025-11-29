import { ErrorResponse } from "./error-handler";

const handleResponse = async <T>(response: Response): Promise<T | ErrorResponse> => {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorResponse = new ErrorResponse(
      body?.message || response.statusText || "An error occurred",
      body?.errorCode || "",
      response.status,
      body?.timeStamp || new Date().toISOString(),
      body?.stack || null
    );

    return errorResponse;
  }

  return body as T;
};

export default handleResponse;
