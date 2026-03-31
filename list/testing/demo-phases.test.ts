import { describe, expect, it } from "vitest";
import { DEMO_CONVERSATION_PHASES } from "./fixtures/demo-phases";

describe("DEMO_CONVERSATION_PHASES（文档配套示例剧本）", () => {
  it("starts with a text phase", () => {
    expect(DEMO_CONVERSATION_PHASES[0]?.type).toBe("text");
  });

  it("includes all block types used by the UI", () => {
    const blocks = DEMO_CONVERSATION_PHASES.filter((p) => p.type === "block");
    const types = blocks.map((p) => p.blockType);

    expect(types).toContain("task_list");
    expect(types).toContain("confirm_panel");
    expect(types).toContain("supplement_form");
  });

  it("has unique string ids for each phase", () => {
    const ids = DEMO_CONVERSATION_PHASES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ends with report-related text after blocks", () => {
    const tail = DEMO_CONVERSATION_PHASES.slice(-3);
    const textPhases = tail.filter((p) => p.type === "text");
    expect(textPhases.length).toBeGreaterThanOrEqual(1);
  });
});
