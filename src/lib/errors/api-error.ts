export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type ApiErrorPayload = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

const API_ERROR_STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export function getStatusForApiErrorCode(code: ApiErrorCode): number {
  return API_ERROR_STATUS_BY_CODE[code];
}

export function createApiErrorResponse(
  code: ApiErrorCode,
  message: string,
  init?: ResponseInit,
): Response {
  const payload: ApiErrorPayload = {
    error: {
      code,
      message,
    },
  };

  return Response.json(payload, {
    ...init,
    status: init?.status ?? getStatusForApiErrorCode(code),
  });
}
