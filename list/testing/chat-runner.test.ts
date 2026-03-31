import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { delay, streamText } from "./fixtures/stream-utils";

describe("stream-utils（文档配套 fixtures）", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("streamText", () => {
    it("appends chars per tick until full text", async () => {
      const updates: string[] = [];
      const done = streamText("abcd", (partial) => updates.push(partial), {
        charsPerTick: 2,
        tickInterval: 10,
      });

      await vi.runAllTimersAsync();
      await done;

      expect(updates.length).toBeGreaterThan(0);
      expect(updates.at(-1)).toBe("abcd");
    });
  });

  describe("delay", () => {
    it("resolves after the given milliseconds", async () => {
      const p = delay(500);
      await vi.advanceTimersByTimeAsync(500);
      await expect(p).resolves.toBeUndefined();
    });
  });
});
