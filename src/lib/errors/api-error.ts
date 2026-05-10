import { ZodError } from 'zod';

export type ApiErrorCode =
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'CONFLICT'
    | 'INTERNAL_ERROR';

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

export function createApiErrorResponse(code: ApiErrorCode, message: string, init?: ResponseInit): Response {
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

/**
 * Formats a validation response from the first Zod issue only.
 * If callers need aggregated validation feedback, add a separate helper.
 */
export function createValidationErrorResponse(error: ZodError, init?: ResponseInit): Response {
    const firstIssue = error.issues[0];
    const pathPrefix = firstIssue && firstIssue.path.length > 0 ? `${firstIssue.path.join('.')}: ` : '';
    const message = firstIssue ? `${pathPrefix}${firstIssue.message}` : 'Validation failed.';

    return createApiErrorResponse('VALIDATION_ERROR', message, init);
}
