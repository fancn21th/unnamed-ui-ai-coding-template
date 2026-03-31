import type React from "react";

/** 与典型「对话剧本」结构一致的示例类型（自包含，不引用宿主别名）。 */
export type DemoSimulationPhase =
  | {
      id: string;
      type: "text";
      content: string;
      charsPerTick?: number;
      tickInterval?: number;
    }
  | { id: string; type: "delay"; delayMs: number }
  | {
      id: string;
      type: "block";
      blockType: "task_list" | "confirm_panel" | "supplement_form";
    }
  | { id: string; type: "instant"; render: () => React.ReactNode };

/**
 * 用于文档配套测试的示例阶段表：首段流式、三处阻塞、收尾流式。
 * 不代表真实业务文案，仅校验结构约束。
 */
export const DEMO_CONVERSATION_PHASES: DemoSimulationPhase[] = [
  { id: "intro", type: "text", content: "开场", charsPerTick: 2, tickInterval: 20 },
  { id: "task_list", type: "block", blockType: "task_list" },
  { id: "step_a", type: "text", content: "中段", charsPerTick: 2, tickInterval: 20 },
  { id: "confirm_panel", type: "block", blockType: "confirm_panel" },
  { id: "supplement_form", type: "block", blockType: "supplement_form" },
  { id: "report_intro", type: "text", content: "报告说明", charsPerTick: 2, tickInterval: 20 },
  { id: "report_card", type: "instant", render: () => null },
  { id: "report_tail", type: "text", content: "收尾提示", charsPerTick: 2, tickInterval: 20 },
];
