import type React from "react";

/**
 * 模拟阶段类型
 */
export type SimulationPhase =
  | {
      id: string;
      type: "text";
      /** 文本内容，支持流式输出 */
      content: string;
      /** 每次追加的字符数，默认 2 */
      charsPerTick?: number;
      /** 每个 tick 的间隔 ms，默认 30 */
      tickInterval?: number;
    }
  | {
      id: string;
      type: "delay";
      /** 延迟毫秒数 */
      delayMs: number;
    }
  | {
      id: string;
      type: "block";
      /** 阻塞类型，用于选择对应的交互组件 */
      blockType: "task_list" | "confirm_panel" | "supplement_form";
    }
  | {
      id: string;
      type: "instant";
      /** 立即渲染的内容 */
      render: () => React.ReactNode;
    };

/**
 * 模拟配置
 */
export interface SimulationConfig {
  phases: SimulationPhase[];
}

/**
 * 模拟事件
 */
export type SimulationEvent =
  | { type: "content"; content: React.ReactNode }
  | { type: "stream_update"; content: React.ReactNode }
  | { type: "block"; blockType: string; onConfirm: () => void }
  | { type: "done" };
