import { z } from "zod";

import {
  createApiErrorResponse,
  createValidationErrorResponse,
  getStatusForApiErrorCode,
  type ApiErrorCode,
} from "./api-error";

const statusCases: Array<[ApiErrorCode, number]> = [
  ["UNAUTHORIZED", 401],
  ["FORBIDDEN", 403],
  ["NOT_FOUND", 404],
  ["VALIDATION_ERROR", 400],
  ["CONFLICT", 409],
  ["INTERNAL_ERROR", 500],
];

describe("getStatusForApiErrorCode", () => {
  test.each(statusCases)("maps %s to %i", (code, expectedStatus) => {
    expect(getStatusForApiErrorCode(code)).toBe(expectedStatus);
  });
});

describe("createApiErrorResponse", () => {
  test("returns the production spec error shape", async () => {
    const response = createApiErrorResponse(
      "FORBIDDEN",
      "You do not have access to this trip.",
    );

    await expect(response.json()).resolves.toEqual({
      error: {
        code: "FORBIDDEN",
        message: "You do not have access to this trip.",
      },
    });
    expect(response.status).toBe(403);
    expect(response.headers.get("content-type") ?? "").toMatch(
      /application\/json/,
    );
  });

  test("allows callers to override the derived status", () => {
    const response = createApiErrorResponse("INTERNAL_ERROR", "Unexpected", {
      status: 503,
    });

    expect(response.status).toBe(503);
  });
});

describe("createValidationErrorResponse", () => {
  test("converts a ZodError into the shared validation error shape", async () => {
    const schema = z.object({
      name: z.string().min(1),
    });
    const result = schema.safeParse({ name: "" });

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected schema parsing to fail.");
    }

    const response = createValidationErrorResponse(result.error);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: expect.any(String),
      },
    });
    expect(payload.error.message).toContain("name");
    expect(payload.error.message).toContain("string");
  });

  test("uses the first Zod issue when formatting the validation error message", async () => {
    const schema = z.object({
      name: z.string().min(1),
      email: z.email(),
    });
    const result = schema.safeParse({ name: "", email: "invalid" });

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected schema parsing to fail.");
    }

    const response = createValidationErrorResponse(result.error);
    const payload = await response.json();

    expect(payload).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: expect.any(String),
      },
    });
    expect(payload.error.message).toContain("name");
    expect(payload.error.message).not.toContain("email");
  });
});
