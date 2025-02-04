import { describe } from "node:test";
import { expect, it } from "vitest";
import { DynamoDbError } from "../db/types/db-types.js";
import * as sendCommandUtil from "../db/utils/index.js";

describe("sendCommand util", () => {
  it("invokes a function if provided one", async () => {
    const fn = () => new Promise((res, rej) => res(1));
    const res = await sendCommandUtil.sendCommand(fn);
    expect(res).toBe(1);
  });

  it("throws a DatabaseGenericError if the provided function is rejected", async () => {
    const err: DynamoDbError = {
      $metadata: { httpStatusCode: 500, requestId: "123" },
      message: "boom",
      name: "DB ERROR",
    };
    const fn = () => new Promise((res, rej) => rej(err));

    try {
      await sendCommandUtil.sendCommand(fn);
    } catch (error) {
      expect(error.message).toBe(err.message);
    }
  });
});
