import assert from "node:assert/strict";

import {
  createApiErrorResponse,
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

async function runTest(name: string, testFn: () => void | Promise<void>) {
  try {
    await testFn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

async function main() {
  for (const [code, expectedStatus] of statusCases) {
    await runTest(`maps ${code} to ${expectedStatus}`, () => {
      assert.equal(getStatusForApiErrorCode(code), expectedStatus);
    });
  }

  await runTest("returns the production spec error shape", async () => {
    const response = createApiErrorResponse(
      "FORBIDDEN",
      "You do not have access to this trip.",
    );

    assert.deepEqual(await response.json(), {
      error: {
        code: "FORBIDDEN",
        message: "You do not have access to this trip.",
      },
    });
    assert.equal(response.status, 403);
    assert.match(
      response.headers.get("content-type") ?? "",
      /application\/json/,
    );
  });

  await runTest("allows callers to override the derived status", () => {
    const response = createApiErrorResponse("INTERNAL_ERROR", "Unexpected", {
      status: 503,
    });

    assert.equal(response.status, 503);
  });
}

void main();
