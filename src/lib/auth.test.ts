import { describe, it, expect } from "vitest";
import { signSession, verifySession, checkPassword } from "./auth";

const SECRET = "test-secret-test-secret";
const NOW = 1_000_000_000_000;

describe("session signing", () => {
  it("verifies a freshly signed token", () => {
    const token = signSession(NOW, SECRET);
    expect(verifySession(token, NOW + 1000, SECRET)).toBe(true);
  });
  it("rejects a tampered signature", () => {
    const token = signSession(NOW, SECRET);
    const tampered = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");
    expect(verifySession(tampered, NOW + 1000, SECRET)).toBe(false);
  });
  it("rejects an expired token", () => {
    const token = signSession(NOW, SECRET);
    expect(verifySession(token, NOW + 1000 * 60 * 60 * 24, SECRET)).toBe(false);
  });
  it("rejects a token signed with a different secret", () => {
    const token = signSession(NOW, "other-secret-other-secret");
    expect(verifySession(token, NOW + 1000, SECRET)).toBe(false);
  });
  it("rejects undefined / malformed tokens", () => {
    expect(verifySession(undefined, NOW, SECRET)).toBe(false);
    expect(verifySession("garbage", NOW, SECRET)).toBe(false);
  });
});

describe("checkPassword", () => {
  it("accepts the exact password", () => {
    expect(checkPassword("hunter2", "hunter2")).toBe(true);
  });
  it("rejects a wrong password", () => {
    expect(checkPassword("nope", "hunter2")).toBe(false);
  });
  it("rejects when expected is empty", () => {
    expect(checkPassword("anything", "")).toBe(false);
  });
});
