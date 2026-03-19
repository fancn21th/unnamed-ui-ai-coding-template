"use client";

import * as React from "react";
import { streamText, delay } from "./runner";
import type { SimulationPhase } from "./types";
import { CSR_REPORT_PHASES } from "./config";

export interface UseChatSimulationOptions {
  /** 阶段配置，默认使用 CSR_REPORT_PHASES */
  phases?: SimulationPhase[];
}

export interface ChatSimulationState {
  /** 当前阶段索引 */
  phaseIndex: number;
  /** 当前阶段 id */
  phaseId: string | null;
  /** 流式输出的文本（仅 text 阶段） */
  streamingText: string;
  /** 是否正在流式输出 */
  isStreaming: boolean;
  /** 是否处于阻塞状态，等待用户确认 */
  isBlocked: boolean;
  /** 阻塞类型 */
  blockType: string | null;
  /** 是否已完成 */
  isDone: boolean;
  /** 是否正在生成（包括流式、阻塞） */
  isGenerating: boolean;
}

export interface UseChatSimulationReturn extends ChatSimulationState {
  /** 发送消息，开始模拟 */
  sendMessage: () => void;
  /** 用户确认阻塞点，继续模拟 */
  confirmBlock: () => void;
  /** 重置状态 */
  reset: () => void;
}

const INITIAL_STATE: ChatSimulationState = {
  phaseIndex: -1,
  phaseId: null,
  streamingText: "",
  isStreaming: false,
  isBlocked: false,
  blockType: null,
  isDone: false,
  isGenerating: false,
};

export function useChatSimulation(
  options: UseChatSimulationOptions = {},
): UseChatSimulationReturn {
  const phases = options.phases ?? CSR_REPORT_PHASES;
  const [state, setState] = React.useState<ChatSimulationState>(INITIAL_STATE);
  const runRef = React.useRef(false);
  const resolveBlockRef = React.useRef<(() => void) | null>(null);

  const runPhase = React.useCallback(
    async (index: number): Promise<void> => {
      if (index >= phases.length) {
        setState((s) => ({
          ...s,
          phaseIndex: index,
          phaseId: null,
          isDone: true,
          isGenerating: false,
          isStreaming: false,
          isBlocked: false,
          blockType: null,
        }));
        return;
      }

      const phase = phases[index];
      setState((s) => ({
        ...s,
        phaseIndex: index,
        phaseId: phase.id,
      }));

      if (phase.type === "text") {
        setState((s) => ({ ...s, isStreaming: true }));
        await streamText(
          phase.content,
          (partial) => {
            setState((s) => ({ ...s, streamingText: partial }));
          },
          {
            charsPerTick: phase.charsPerTick,
            tickInterval: phase.tickInterval,
          },
        );
        setState((s) => ({
          ...s,
          streamingText: phase.content,
          isStreaming: false,
        }));
        await runPhase(index + 1);
      } else if (phase.type === "block") {
        setState((s) => ({
          ...s,
          isBlocked: true,
          blockType: phase.blockType,
        }));
        await new Promise<void>((resolve) => {
          resolveBlockRef.current = resolve;
        });
        resolveBlockRef.current = null;
        setState((s) => ({
          ...s,
          isBlocked: false,
          blockType: null,
        }));
        await runPhase(index + 1);
      } else if (phase.type === "delay") {
        await delay(phase.delayMs);
        await runPhase(index + 1);
      } else {
        // instant
        await runPhase(index + 1);
      }
    },
    [phases],
  );

  const sendMessage = React.useCallback(() => {
    if (runRef.current) return;
    runRef.current = true;
    setState((s) => ({
      ...s,
      ...INITIAL_STATE,
      isGenerating: true,
    }));
    runPhase(0).finally(() => {
      runRef.current = false;
    });
  }, [runPhase]);

  const confirmBlock = React.useCallback(() => {
    resolveBlockRef.current?.();
  }, []);

  const reset = React.useCallback(() => {
    runRef.current = false;
    resolveBlockRef.current = null;
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    sendMessage,
    confirmBlock,
    reset,
  };
}
