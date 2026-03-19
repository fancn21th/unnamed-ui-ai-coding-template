/**
 * 对话模拟模块
 *
 * 提供流式输出与阻塞式交互的模拟逻辑，与 UI 解耦。
 */

export type { SimulationPhase, SimulationConfig, SimulationEvent } from "./types";
export type { UseChatSimulationOptions, ChatSimulationState, UseChatSimulationReturn } from "./use-chat-simulation";
export { streamText } from "./runner";
export { useChatSimulation } from "./use-chat-simulation";
export { CSR_REPORT_PHASES } from "./config";
