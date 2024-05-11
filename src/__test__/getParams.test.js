import { getSearchParams } from "@/utils";
import { describe, test, expect } from "vitest";
describe("getSearchParams", () => {
  test("no search param", () => {
    const href = "";
    expect(getSearchParams(href)).toStrictEqual({});
  });
  test("one search param", () => {
    const href = "?roomId=1234";
    expect(getSearchParams(href)).toStrictEqual({ roomId: "1234" });
  });
  test("more than one search params", () => {
    const href = "?roomId=1234&ok=true";
    expect(getSearchParams(href)).toStrictEqual({ roomId: "1234", ok: "true" });
  });
});
