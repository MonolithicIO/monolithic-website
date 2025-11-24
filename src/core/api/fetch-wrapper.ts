interface ErrorResponse {
  message: string;
  errorCode: string;
  statusCode: number;
  timeStamp: string;
}

interface FetchOptions<TRequest = any> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: TRequest;
}

interface FetchResult<TResponse> {
  data?: TResponse;
  error?: ErrorResponse;
}

async function fetchWrapper<TRequest = any, TResponse = any>(
  url: string,
  options: FetchOptions<TRequest>
): Promise<FetchResult<TResponse>> {
  try {
    const config: RequestInit = {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (options.body && options.method !== "GET") {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: ErrorResponse;

      try {
        const serverError = await response.json();
        errorData = {
          message: serverError.message || "Erro na requisição",
          errorCode: serverError.errorCode || "UNKNOWN_ERROR",
          statusCode: response.status,
          timeStamp: serverError.timeStamp || new Date().toISOString(),
        };
      } catch {
        errorData = {
          message: response.statusText || "Erro na requisição",
          errorCode: "HTTP_ERROR",
          statusCode: response.status,
          timeStamp: new Date().toISOString(),
        };
      }

      return { error: errorData };
    }

    const data: TResponse = await response.json();
    return { data };
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      errorCode: "NETWORK_ERROR",
      statusCode: 0,
      timeStamp: new Date().toISOString(),
    };

    return { error: errorResponse };
  }
}

export { fetchWrapper, type ErrorResponse, type FetchOptions, type FetchResult };
