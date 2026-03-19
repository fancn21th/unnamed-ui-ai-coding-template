import type { SimulationPhase } from "./types";

export const INTRO_TEXT =
  "我已接收到了用户的材料文件，即将梳理思路，为用户输出以「01--3.Chinese_CSR_v2.0_09Dec11 2 -SAMPLE-empty templet」为模板的临床试验报告。为了给用户最严谨的反馈，我需要按照以下步骤执行任务：";

export const STEP1_CONTENT_1 = "查找符合监管要求的模板文件，我将调用数据来源查询工具";
export const STEP1_CONTENT_2 = "查找符合监管要求的模板文件，我将调用企业知识查询工具";
export const STEP2_CONTENT = "查找符合监管要求的模板文件，我将调用企业知识查询工具";

export const REPORT_INTRO =
  "您可以点击报告卡片查阅或修改已生成的 IC-265 CSR临床试验报告，已自动化为您保存。";
export const REPORT_TAIL =
  "报告模板中的「10.2.4 治疗期」章节缺少必要的统计分析文件信息，无法一次性生成完成，建议邀请「统计专家」进入工作空间，补充必要性材料后继续。";

const ITEM_DELAY = 3200;
const TOOL_DELAY = 3000;
const STEP_DELAY = 3500;

/**
 * CSR 报告对话的模拟阶段配置
 *
 * 阶段顺序：intro(stream) -> task_list(block) -> step1(逐项+延时) -> confirm_panel(block)
 * -> step2(逐项+延时) -> supplement_form(block) -> steps3_6(逐步+延时) -> report(stream)
 */
export const CSR_REPORT_PHASES: SimulationPhase[] = [
  // 0: intro
  { id: "intro", type: "text", content: INTRO_TEXT, charsPerTick: 2, tickInterval: 25 },
  // 1: task_list
  { id: "task_list", type: "block", blockType: "task_list" },
  // 2-8: step1 逐项
  { id: "step1_0", type: "text", content: STEP1_CONTENT_1, charsPerTick: 2, tickInterval: 25 },
  { id: "step1_d0", type: "delay", delayMs: ITEM_DELAY },
  { id: "step1_1", type: "instant", render: () => null },
  { id: "step1_d1", type: "delay", delayMs: TOOL_DELAY },
  { id: "step1_2", type: "instant", render: () => null },
  { id: "step1_3", type: "text", content: STEP1_CONTENT_2, charsPerTick: 2, tickInterval: 25 },
  { id: "step1_d2", type: "delay", delayMs: ITEM_DELAY },
  { id: "step1_4", type: "instant", render: () => null },
  { id: "step1_d3", type: "delay", delayMs: TOOL_DELAY },
  { id: "step1_5", type: "instant", render: () => null },
  { id: "step1_6", type: "instant", render: () => null },
  // 9: confirm_panel
  { id: "confirm_panel", type: "block", blockType: "confirm_panel" },
  // 10-12: step2
  { id: "step2_0", type: "text", content: STEP2_CONTENT, charsPerTick: 2, tickInterval: 25 },
  { id: "step2_d0", type: "delay", delayMs: ITEM_DELAY },
  { id: "step2_1", type: "instant", render: () => null },
  { id: "step2_2", type: "instant", render: () => null },
  // 13: supplement_form
  { id: "supplement_form", type: "block", blockType: "supplement_form" },
  // 14-30: steps3_6 四个子步骤，每个步骤内子项逐步出现（delay -> 更多 item）
  // 解析模板 (8 items): 4 个 delay 批次
  { id: "steps3_6_0_0", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_0_1", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_0_2", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_0_3", type: "delay", delayMs: STEP_DELAY },
  // 多源材料解析 (16 items): 4 个 delay 批次
  { id: "steps3_6_1_0", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_1_1", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_1_2", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_1_3", type: "delay", delayMs: STEP_DELAY },
  // 任务编排 (8 items): 4 个 delay 批次
  { id: "steps3_6_2_0", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_2_1", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_2_2", type: "delay", delayMs: STEP_DELAY },
  { id: "steps3_6_2_3", type: "delay", delayMs: STEP_DELAY },
  // 报告整合 (2 items): 1 个 delay
  { id: "steps3_6_3_0", type: "delay", delayMs: STEP_DELAY },
  // 31-33: report
  { id: "report_intro", type: "text", content: REPORT_INTRO, charsPerTick: 2, tickInterval: 25 },
  { id: "report_card", type: "instant", render: () => null },
  { id: "report_tail", type: "text", content: REPORT_TAIL, charsPerTick: 2, tickInterval: 25 },
];
