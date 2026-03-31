import type React from "react";

/**
 * 最小对话模拟阶段示例（教学/复制用）。
 *
 * 顺序：短流式 intro → 待办阻塞 → 一段 outro 流式。
 * 合并进宿主项目时：将类型与宿主 `SimulationPhase` 对齐，并把数组并入正式 config。
 *
 * 本文件故意 **不** 使用路径别名 import，便于与 `list/` 一并脱库上传、复制到任意工程。
 */
export type SimulationPhase =
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

export const MINIMAL_DEMO_PHASES: SimulationPhase[] = [
  {
    id: "intro",
    type: "text",
    content: "你好，这是最小演示剧本的开场白。",
    charsPerTick: 2,
    tickInterval: 20,
  },
  {
    id: "todo_block",
    type: "block",
    blockType: "task_list",
  },
  {
    id: "outro",
    type: "text",
    content: "你已确认待办，后续可在此接入真实接口或更多阶段。",
    charsPerTick: 2,
    tickInterval: 20,
  },
];
