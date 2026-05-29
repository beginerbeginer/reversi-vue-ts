import { describe, it, expect } from "vitest";
import { resolveTheme } from "@/plugins/vuetify";

describe("resolveTheme", () => {
  it("'light' を返す（保存値が light の場合）", () => {
    expect(resolveTheme("light", false)).toBe("light");
  });

  it("'dark' を返す（保存値が dark の場合）", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("'dark' を返す（保存値がなくシステムがダーク設定の場合）", () => {
    expect(resolveTheme(null, true)).toBe("dark");
  });

  it("'light' を返す（保存値がなくシステムがライト設定の場合）", () => {
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("'light' を返す（保存値が無効な値の場合）", () => {
    expect(resolveTheme("auto", false)).toBe("light");
  });

  it("'dark' を返す（保存値が無効な値でシステムがダーク設定の場合）", () => {
    expect(resolveTheme("bogus", true)).toBe("dark");
  });

  it("'light' を返す（保存値が空文字の場合）", () => {
    expect(resolveTheme("", false)).toBe("light");
  });
});
