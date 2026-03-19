"use client";

import * as React from "react";
import {
  Search,
  Database,
  FileText,
  LayoutList,
  MessageSquare,
  AlertTriangle,
  Globe,
  BarChart3,
  FlaskConical,
} from "lucide-react";
import {
  ThinkingProcessContainerPrimitive,
} from "@/components/wuhan/blocks/thinking-process-01";
import {
  ThinkingStep,
  type ThinkingStepContentBlock,
} from "@/components/wuhan/composed/thinking-process";
import type { ThinkingStepItemProps } from "@/components/wuhan/composed/thinking-step-item";
import { TaskList } from "@/components/wuhan/composed/task-list";
import { ConfirmPanel } from "@/components/wuhan/composed/confirm-panel";
import { DynamicForm } from "@/components/wuhan/composed/dynamic-form";
import { ReportCard } from "@/components/wuhan/composed/report-card";
import { FileCard } from "@/components/wuhan/composed/file-card";
import Markdown from "@/components/wuhan/composed/markdown";
import type { ChatSimulationState } from "@/lib/chat-simulation";
import type { FieldSchema } from "@/components/wuhan/composed/dynamic-form";
import {
  INTRO_TEXT,
  STEP1_CONTENT_1,
  STEP1_CONTENT_2,
  STEP2_CONTENT,
  REPORT_INTRO,
  REPORT_TAIL,
} from "@/lib/chat-simulation/config";

const TODO_ITEMS = [
  { id: "1", content: "确定模板", order: 1 },
  { id: "2", content: "明确数据来源", order: 2 },
  { id: "3", content: "解析模板", order: 3 },
  { id: "4", content: "多源材料解析", order: 4 },
  { id: "5", content: "任务编排", order: 5 },
  { id: "6", content: "逐章节推理质量审查", order: 6 },
];

const SUPPLEMENT_FORM_SCHEMA = {
  title: "补充信息",
  fields: [
    {
      name: "sap",
      label: "1. SAP（统计分析计划）文件是哪份文档？",
      type: "input" as const,
      defaultValue: "",
      render: ({ field }: { field: FieldSchema }) => (
        <div className="flex flex-col gap-[var(--Gap-gap-md)]">
          <span className="font-size-2 font-[var(--font-weight-600)] text-[var(--Text-text-primary)]">{field.label}</span>
          <div className="flex flex-wrap gap-[var(--Gap-gap-xl)]">
            <FileCard id="sap-1" title="01-02.SAP - SAMPLE" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
          </div>
        </div>
      ),
    },
    {
      name: "tfls",
      label: "2. TFLs（Tables / Figures / Listings）是哪些文档？",
      type: "input" as const,
      defaultValue: "",
      render: ({ field }: { field: FieldSchema }) => (
        <div className="flex flex-col gap-[var(--Gap-gap-md)]">
          <span className="font-size-2 font-[var(--font-weight-600)] text-[var(--Text-text-primary)]">{field.label}</span>
          <div className="flex flex-wrap gap-[var(--Gap-gap-xl)]">
            <FileCard id="tfls-1" title="f_14_02_01_01" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
            <FileCard id="tfls-2" title="f_14_02_01_02" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
            <FileCard id="tfls-3" title="f_14_02_01_03" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
          </div>
        </div>
      ),
    },
    {
      name: "appendix",
      label: "3. 附录文件是哪些文档？",
      type: "input" as const,
      defaultValue: "",
      render: ({ field }: { field: FieldSchema }) => (
        <div className="flex flex-col gap-[var(--Gap-gap-md)]">
          <span className="font-size-2 font-[var(--font-weight-600)] text-[var(--Text-text-primary)]">{field.label}</span>
          <div className="flex flex-wrap gap-[var(--Gap-gap-xl)]">
            <FileCard id="app-1" title="S1" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
            <FileCard id="app-2" title="S2" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
          </div>
        </div>
      ),
    },
  ],
};

/**
 * phaseIndex 与可见性映射（与 config 中 CSR_REPORT_PHASES 顺序一致）
 * step1: 2-12, step2: 14-17, steps3_6: 19-26, report: 27-29
 */
const STEP1_FIRST_PHASE = 2;
const STEP1_LAST_PHASE = 12;
const STEP2_FIRST_PHASE = 14;
const STEP2_LAST_PHASE = 17;
const STEPS36_FIRST_PHASE = 19;
const STEPS36_LAST_PHASE = 31;
const REPORT_INTRO_PHASE = 32;
const REPORT_CARD_PHASE = 33;
const REPORT_TAIL_PHASE = 34;

/** step1: 每个 text/instant 阶段增加 1 个 item，delay 阶段保持 */
const STEP1_VISIBLE_BY_PHASE: Record<number, number> = {
  2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 7,
};

function getStep1VisibleCount(phaseIndex: number): number {
  if (phaseIndex < STEP1_FIRST_PHASE) return 0;
  if (phaseIndex > STEP1_LAST_PHASE) return 7;
  return STEP1_VISIBLE_BY_PHASE[phaseIndex] ?? 0;
}

/** step2: 14->1, 15->1, 16->2, 17->3 */
function getStep2VisibleCount(phaseIndex: number): number {
  if (phaseIndex < STEP2_FIRST_PHASE) return 0;
  if (phaseIndex > STEP2_LAST_PHASE) return 3;
  if (phaseIndex <= 15) return 1;
  if (phaseIndex <= 16) return 2;
  return 3;
}

/** steps3_6 各步骤的 item 数量 */
const STEPS36_ITEM_COUNTS = [8, 16, 8, 2];

/**
 * steps3_6: 19-31，每个 phase 对应一个 delay 批次
 * 19-22: 解析模板 2,4,6,8 items
 * 23-26: 多源材料解析 4,8,12,16 items
 * 27-30: 任务编排 2,4,6,8 items
 * 31: 报告整合 2 items
 */
const STEPS36_PHASE_OFFSET = 19;
const STEPS36_STEP_PHASE_RANGES: [number, number][] = [
  [0, 4],   // step 0: phases 19-22
  [4, 8],   // step 1: phases 23-26
  [8, 12],  // step 2: phases 27-30
  [12, 13], // step 3: phase 31
];

/** 每步各批次的 item 数量 */
const STEPS36_BATCHES: number[][] = [
  [2, 4, 6, 8],      // step 0
  [4, 8, 12, 16],   // step 1
  [2, 4, 6, 8],     // step 2
  [2],              // step 3
];

function getSteps36VisibleCount(phaseIndex: number): number {
  if (phaseIndex < STEPS36_FIRST_PHASE) return 0;
  if (phaseIndex > STEPS36_LAST_PHASE) return 4;
  const p = phaseIndex - STEPS36_PHASE_OFFSET;
  for (let s = 0; s < 4; s++) {
    const [start, end] = STEPS36_STEP_PHASE_RANGES[s];
    if (p < end) return s + 1;
  }
  return 4;
}

/** 获取指定 step 在当前 phase 下应显示的 item 数量 */
function getSteps36StepItemCount(phaseIndex: number, stepIndex: number): number {
  if (phaseIndex < STEPS36_FIRST_PHASE) return 0;
  const total = STEPS36_ITEM_COUNTS[stepIndex];
  const p = phaseIndex - STEPS36_PHASE_OFFSET;
  const [start, end] = STEPS36_STEP_PHASE_RANGES[stepIndex];
  if (p < start) return 0;
  if (p >= end) return total;
  const batchIndex = p - start;
  const batches = STEPS36_BATCHES[stepIndex];
  return batches[batchIndex] ?? total;
}

/**
 * 根据模拟状态构建 AI 消息内容（含流式输出与阻塞式交互）
 */
export function buildStreamingContent(
  state: ChatSimulationState,
  onConfirmBlock: () => void,
): React.ReactNode {
  const { phaseIndex, phaseId, streamingText, isBlocked, blockType, isStreaming, isDone } = state;

  if (phaseIndex < 0) return null;

  const taskListBlocked = isBlocked && blockType === "task_list";
  const confirmPanelBlocked = isBlocked && blockType === "confirm_panel";
  const supplementFormBlocked = isBlocked && blockType === "supplement_form";

  const showTaskList = phaseIndex >= 1;
  const step1VisibleCount = getStep1VisibleCount(phaseIndex);
  const step2VisibleCount = getStep2VisibleCount(phaseIndex);
  const steps36VisibleCount = getSteps36VisibleCount(phaseIndex);
  const showReportIntro = phaseIndex >= REPORT_INTRO_PHASE;
  const showReportCard = phaseIndex >= REPORT_CARD_PHASE;
  const showReportTail = phaseIndex >= REPORT_TAIL_PHASE;

  // intro 文本：phaseId===intro 时用 streamingText
  const introText =
    phaseId === "intro"
      ? (isStreaming ? streamingText : INTRO_TEXT)
      : phaseIndex > 0
        ? INTRO_TEXT
        : "";

  const contentBlocks: ThinkingStepContentBlock[] = [];
  const addBlock = (block: ThinkingStepContentBlock) => contentBlocks.push(block);

  addBlock({ type: "text", content: introText });

  if (showTaskList) {
    addBlock({
      type: "node",
      node: (
        <div className="flex flex-col gap-[var(--Gap-gap-sm)]">
          <TaskList
            dataSource={TODO_ITEMS}
            title="待办清单"
            status={taskListBlocked ? "pending" : "confirmed"}
            editable={taskListBlocked}
            onItemsChange={() => {}}
            onConfirmExecute={taskListBlocked ? onConfirmBlock : () => {}}
          />
          <p className="font-size-1 leading-[var(--line-height-1)] text-[var(--Text-text-warning)]">
            问学将在你回复后继续工作
          </p>
        </div>
      ),
    });
  }

  const allSteps: Array<ThinkingStepItemProps & { key?: React.Key }> = [];

  // Step 1: 确定模板
  if (step1VisibleCount > 0) {
    const step1Item0Content =
      phaseId === "step1_0" ? (isStreaming ? streamingText : STEP1_CONTENT_1) : STEP1_CONTENT_1;
    const step1Item3Content =
      phaseId === "step1_3" ? (isStreaming ? streamingText : STEP1_CONTENT_2) : STEP1_CONTENT_2;

    const step1Items: ThinkingStepItemProps["items"] = [
      { content: step1Item0Content },
      {
        toolCall: {
          icon: <Search className="size-3" />,
          title: "数据来源查询",
          content: '从数据来源中查询关于 "IC - 265" 的报告模板',
        },
      },
      { files: [{ name: "AI发展趋势.pdf", status: "ready" as const }] },
      { content: step1Item3Content },
      {
        toolCall: {
          icon: <Database className="size-3" />,
          title: "企业知识查询",
          content: '从企业知识库查询关于 "IC - 265" 的报告模板',
        },
      },
      { files: [{ name: "IC - 265.pdf", status: "ready" as const }] },
    ];
    if (step1VisibleCount >= 7) {
      step1Items.push({
        render: () => (
          <ConfirmPanel
            title="选择模板"
            status={confirmPanelBlocked ? "pending" : "confirmed"}
            contentClassName="flex flex-col gap-[var(--Gap-gap-lg)]"
            onConfirm={confirmPanelBlocked ? onConfirmBlock : undefined}
          >
            <p className="font-size-2 leading-[var(--line-height-2)] text-[var(--Text-text-primary)]">
              你可点击【模版卡片】，查看或修改模板，确认无误后，选择符合你需求的报告模板？
            </p>
            <ReportCard
              title="候选人能力评估报告评估报告 · 张怡"
              description="更新时间：2分钟前"
              icon={<BarChart3 className="size-4 text-[var(--Text-text-brand)]" />}
              showAction={false}
              width="100%"
            />
          </ConfirmPanel>
        ),
      });
    }

    const step1ItemsToShow = step1Items.slice(0, step1VisibleCount);
    const isStep1Current = phaseIndex >= STEP1_FIRST_PHASE && phaseIndex <= STEP1_LAST_PHASE;

    allSteps.push({
      title: "确定模板：查找符合监管要求的模板文件，并明确最终选用的模板文件",
      status: (isStep1Current ? "loading" : "success") as ThinkingStepItemProps["status"],
      items: step1ItemsToShow,
    });
  }

  // Step 2: 明确数据来源
  if (step2VisibleCount > 0) {
    const step2Item0Content =
      phaseId === "step2_0" ? (isStreaming ? streamingText : STEP2_CONTENT) : STEP2_CONTENT;

    const step2Items: ThinkingStepItemProps["items"] = [
      { content: step2Item0Content },
      {
        toolCall: {
          icon: <Database className="size-3" />,
          title: "企业知识查询",
          content: '从企业知识库查询关于 "IC - 265" 的报告模板',
        },
      },
    ];
    if (step2VisibleCount >= 3) {
      step2Items.push({
        render: () => (
          <DynamicForm
            schema={SUPPLEMENT_FORM_SCHEMA}
            status={supplementFormBlocked ? "pending" : "confirmed"}
            showActions={supplementFormBlocked}
            showTitle={true}
            onFinish={supplementFormBlocked ? () => onConfirmBlock() : undefined}
          />
        ),
      });
    }

    const step2ItemsToShow = step2Items.slice(0, step2VisibleCount);
    const isStep2Current = phaseIndex >= STEP2_FIRST_PHASE && phaseIndex <= STEP2_LAST_PHASE;

    allSteps.push({
      title: "明确数据来源",
      status: (isStep2Current ? "loading" : "success") as ThinkingStepItemProps["status"],
      items: step2ItemsToShow,
    });
  }

  // Steps 3-6: 解析模板、多源材料解析、任务编排、报告整合（子项逐步出现）
  if (steps36VisibleCount > 0) {
    const step0ItemCount = getSteps36StepItemCount(phaseIndex, 0);
    const step1ItemCount = getSteps36StepItemCount(phaseIndex, 1);
    const step2ItemCount = getSteps36StepItemCount(phaseIndex, 2);
    const step3ItemCount = getSteps36StepItemCount(phaseIndex, 3);

    const isStep36Current = (s: number) =>
      phaseIndex >= STEPS36_FIRST_PHASE &&
      phaseIndex <= STEPS36_LAST_PHASE &&
      steps36VisibleCount === s + 1 &&
      !isDone; // 流程结束时不再显示 loading

    const steps36Data: Array<ThinkingStepItemProps & { key?: React.Key }> = [
      {
        title: "解析模板：读取模板文件并明确章节映射规则",
        status: (isStep36Current(0) ? "loading" : "success") as ThinkingStepItemProps["status"],
        items: [
          { content: "解析模板，我将调用文档解析工具" },
          {
            toolCall: {
              icon: <FileText className="size-3" />,
              title: "文档解析",
              content: "现在我要开始解析模板，系统开始读取用户选择的「01--3.Chinese_CSR_v2.0_09Dec11 2 -SAMPLE-empty templet」",
            },
          },
          { content: "解析模板，我将调用章节识别工具" },
          {
            toolCall: {
              icon: <Database className="size-3" />,
              title: "章节识别",
              content: "现在开始抽取模板文件的所有章节，并解析章节层级，确保获取到的目录结构正确，并建立章节树",
            },
          },
          { content: "解析模板，我将调用章节处理策略工具" },
          {
            toolCall: {
              icon: <LayoutList className="size-3" />,
              title: "章节处理策略",
              content: "将章节映射至对应的 ICH E3 / 等监管指南条款，明确该章节的合规定位与必填属性。",
            },
          },
          { content: "解析模板，我将调用语义匹配工具" },
          {
            toolCall: {
              icon: <MessageSquare className="size-3" />,
              title: "语义匹配",
              content: "判断是否存在与当前章节高度相似或可直接复用的段落，并给出相似度评分",
            },
          },
        ].slice(0, step0ItemCount),
      },
      {
        title: "多源材料解析：解析数据来源并进行关键信息提取",
        status: (isStep36Current(1) ? "loading" : "success") as ThinkingStepItemProps["status"],
        items: [
          { content: "解析模板，我将调用文档解析工具" },
          {
            toolCall: {
              icon: <FileText className="size-3" />,
              title: "文档解析",
              content: "首先我需要解析 「01-01.PRT_Ver1CH__Chinese - less SAMPLE」 文件",
            },
          },
          { content: "解析模板，我将调用章节解析工具" },
          {
            toolCall: {
              icon: <Database className="size-3" />,
              title: "章节解析",
              content: "已获取标题结构、段落编号、小节标题",
            },
          },
          { content: "解析模板，我将调用文档解析工具" },
          {
            toolCall: {
              icon: <FileText className="size-3" />,
              title: "文档解析",
              content: "接下来我需要解析「01-02.SAP - SAMPLE」文件：",
            },
          },
          { content: "解析模板，我将调用章节解析工具" },
          {
            toolCall: {
              icon: <Database className="size-3" />,
              title: "章节解析",
              content: "已获取标题结构、段落编号、小节标题",
            },
          },
          { content: "解析模板，我将调用文档解析工具" },
          {
            toolCall: {
              icon: <FileText className="size-3" />,
              title: "文档解析",
              content: "现在我需要利用多模态模型针对 99 个rtf格式文件进行解析：",
            },
          },
          { content: "解析模板，我将调用章节解析工具" },
          {
            toolCall: {
              icon: <LayoutList className="size-3" />,
              title: "章节解析",
              content: "已进行RTF格式解析、正在自动生成「结构化TFL表征」、正在理解图表内容",
            },
          },
          { content: "解析模板，我将调用文档解析工具" },
          {
            toolCall: {
              icon: <FileText className="size-3" />,
              title: "文档解析",
              content: "最后我需要对S1、S2、S3、S4文件进行解析",
            },
          },
          { content: "解析模板，我将调用章节解析工具" },
          {
            toolCall: {
              icon: <Database className="size-3" />,
              title: "章节解析",
              content: "正在校验格式、正在验证是否存在丢失字段，已成功将文件识别为模板12 附录章节",
            },
          },
        ].slice(0, step1ItemCount),
      },
      {
        title: "任务编排：明确每个章节的章节处理策略，构建任务列表，并完成任务分配",
        status: (isStep36Current(2) ? "loading" : "success") as ThinkingStepItemProps["status"],
        items: [
          { content: "解析模板，我将调用章节定位工具" },
          {
            toolCall: {
              icon: <Database className="size-3" />,
              title: "章节定位",
              content: "在「01--3.Chinese_CSR_v2.0_09Dec11 2 -SAMPLE-empty templet」模板文件中定位当前待处理章节",
            },
          },
          { content: "解析模板，我将调用文档检索工具" },
          {
            toolCall: {
              icon: <Search className="size-3" />,
              title: "文档检索",
              content: "基于模板文件的章节段落",
            },
          },
          { content: "解析模板，我将调用相似度与可复用性评估工具" },
          {
            toolCall: {
              icon: <LayoutList className="size-3" />,
              title: "相似度与可复用性评估",
              content: "对每个候选来源计算相似度与复用等级（可直接复制/需改写/需补充/不可用）",
            },
          },
          { content: "解析模板，我将调用冲突与风险提示工具" },
          {
            toolCall: {
              icon: <AlertTriangle className="size-3" />,
              title: "冲突与风险提示",
              content:
                "当出现多来源高相似、或来源间关键字段冲突（样本量/时间窗/终点定义等）时，生成风险提示与推荐选择。",
            },
          },
        ].slice(0, step2ItemCount),
      },
      {
        title: "报告整合：梳理并行生成的子报告，并按照模板文件的章节架构进行报告整合",
        status: (isStep36Current(3) ? "loading" : "success") as ThinkingStepItemProps["status"],
        items: [
          { content: "解析模板，我将调用CSR报告组装编排工具工具" },
          {
            toolCall: {
              icon: <Globe className="size-3" />,
              title: "CSR报告组装编排工具",
              content:
                "接下来将进行报告整合，我需要将所有复制内容、受控内容生成的子文档按照文档章节架构进行梳理。",
            },
          },
        ].slice(0, step3ItemCount),
      },
    ];

    const stepsToShow = steps36Data.slice(0, steps36VisibleCount);
    stepsToShow.forEach((s) => allSteps.push(s));
  }

  if (allSteps.length > 0) {
    addBlock({ type: "subSteps", steps: allSteps });
  }

  const thinkingStepStatus = isDone ? "completed" : "thinking";
  const thinkingStepTitle = isDone ? "思考完成" : "思考中";

  return (
    <div className="flex flex-col gap-[var(--Gap-gap-xl)]">
      <ThinkingProcessContainerPrimitive>
        <ThinkingStep
          title={thinkingStepTitle}
          headerMeta={isDone ? "14s" : undefined}
          status={thinkingStepStatus}
          defaultOpen={true}
          contentBlocks={contentBlocks}
        />
      </ThinkingProcessContainerPrimitive>

      {showReportIntro && (
        <Markdown
          content={
            phaseId === "report_intro"
              ? (isStreaming ? streamingText : REPORT_INTRO)
              : REPORT_INTRO
          }
        />
      )}
      {showReportCard && (
        <ReportCard
          title="IC - 265_CSR 报告"
          description="更新时间：18:21"
          icon={<FlaskConical className="size-4 text-[var(--Text-text-brand)]" />}
          showAction={false}
          width="100%"
        />
      )}
      {showReportTail && (
        <Markdown
          content={
            phaseId === "report_tail"
              ? (isStreaming ? streamingText : REPORT_TAIL)
              : REPORT_TAIL
          }
        />
      )}
    </div>
  );
}
