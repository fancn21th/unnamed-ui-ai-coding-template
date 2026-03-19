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
  MessageList,
  type AIMessageItem,
  type UserMessageItem,
} from "@/components/wuhan/composed/message-list";
import {
  ThinkingProcessContainerPrimitive,
} from "@/components/wuhan/blocks/thinking-process-01";
import { ThinkingStep } from "@/components/wuhan/composed/thinking-process";
import { TaskList } from "@/components/wuhan/composed/task-list";
import { ConfirmPanel } from "@/components/wuhan/composed/confirm-panel";
import { DynamicForm, type FieldSchema } from "@/components/wuhan/composed/dynamic-form";
import { ReportCard } from "@/components/wuhan/composed/report-card";
import { FileCard } from "@/components/wuhan/composed/file-card";
import Markdown from "@/components/wuhan/composed/markdown";
import { MessageFeedbackActions } from "@/components/wuhan/composed/message";
import { SuggestionPanel } from "@/components/wuhan/composed/suggestion";
import { ResponsiveSender } from "@/components/wuhan/composed/responsive-sender";
import { cn } from "@/lib/utils";

const USER_MESSAGE: UserMessageItem = {
  id: "user-1",
  role: "user",
  content:
    "各项数据都上传了。缺的东西你去企业知识库找 'IC - 265' 项目数据库找。下面直接帮我生成 CSR 报告",
};

const SUGGESTIONS = [
  { id: "1", label: "介绍一下人工智能如何识别和行业相关的标准", onClick: () => {} },
  { id: "2", label: "如何评估 AI 生成报告的质量？", onClick: () => {} },
  { id: "3", label: "CSR 报告需要包含哪些核心章节？", onClick: () => {} },
];

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
          <span className="font-size-2 font-[var(--font-weight-600)] text-[var(--Text-text-primary)]">
            {field.label}
          </span>
          <div className="flex flex-wrap gap-[var(--Gap-gap-xl)]">
            <FileCard
              id="sap-1"
              title="01-02.SAP - SAMPLE"
              actionMenuItems={[]}
              className="[&>*:last-child]:hidden"
            />
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
          <span className="font-size-2 font-[var(--font-weight-600)] text-[var(--Text-text-primary)]">
            {field.label}
          </span>
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
          <span className="font-size-2 font-[var(--font-weight-600)] text-[var(--Text-text-primary)]">
            {field.label}
          </span>
          <div className="flex flex-wrap gap-[var(--Gap-gap-xl)]">
            <FileCard id="app-1" title="S1" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
            <FileCard id="app-2" title="S2" actionMenuItems={[]} className="[&>*:last-child]:hidden" />
          </div>
        </div>
      ),
    },
  ],
};

const AI_MESSAGE: AIMessageItem = {
  id: "ai-1",
  role: "ai",
  status: "idle",
  content: (
    <div className="flex flex-col gap-[var(--Gap-gap-xl)]">
      <ThinkingProcessContainerPrimitive>
        <ThinkingStep
          title="思考完成"
          headerMeta="14s"
          status="completed"
          defaultOpen={true}
          contentBlocks={[
            {
              type: "text",
              content:
                "我已接收到了用户的材料文件，即将梳理思路，为用户输出以「01--3.Chinese_CSR_v2.0_09Dec11 2 -SAMPLE-empty templet」为模板的临床试验报告。为了给用户最严谨的反馈，我需要按照以下步骤执行任务：",
            },
            {
              type: "node",
              node: (
                <div className="flex flex-col gap-[var(--Gap-gap-sm)]">
                  <TaskList
                    dataSource={TODO_ITEMS}
                    title="待办清单"
                    status="confirmed"
                    editable={false}
                    onItemsChange={() => {}}
                    onConfirmExecute={() => {}}
                  />
                  <p className="font-size-1 leading-[var(--line-height-1)] text-[var(--Text-text-warning)]">
                    问学将在你回复后继续工作
                  </p>
                </div>
              ),
            },
            // 1. 确定模板
            {
              type: "subSteps",
              steps: [
                {
                  title: "确定模板：查找符合监管要求的模板文件，并明确最终选用的模板文件",
                  status: "success",
                  items: [
                    {
                      content: "查找符合监管要求的模板文件，我将调用数据来源查询工具",
                    },
                    {
                      toolCall: {
                        icon: <Search className="size-3" />,
                        title: "数据来源查询",
                        content: '从数据来源中查询关于 "IC - 265" 的报告模板',
                      },
                    },
                    { files: [{ name: "AI发展趋势.pdf", status: "ready" }] },
                    {
                      content: "查找符合监管要求的模板文件，我将调用企业知识查询工具",
                    },
                    {
                      toolCall: {
                        icon: <Database className="size-3" />,
                        title: "企业知识查询",
                        content: '从企业知识库查询关于 "IC - 265" 的报告模板',
                      },
                    },
                    { files: [{ name: "IC - 265.pdf", status: "ready" }] },
                    {
                      render: () => (
                        <ConfirmPanel
                          title="选择模板"
                          status="confirmed"
                          contentClassName="flex flex-col gap-[var(--Gap-gap-lg)]"
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
                    },
                  ],
                },
                // 2. 明确数据来源
                {
                  title: "明确数据来源",
                  status: "success",
                  items: [
                    {
                      content: "查找符合监管要求的模板文件，我将调用企业知识查询工具",
                    },
                    {
                      toolCall: {
                        icon: <Database className="size-3" />,
                        title: "企业知识查询",
                        content: '从企业知识库查询关于 "IC - 265" 的报告模板',
                      },
                    },
                    {
                      render: () => (
                        <DynamicForm
                          schema={SUPPLEMENT_FORM_SCHEMA}
                          status="confirmed"
                          showActions={false}
                          showTitle={true}
                        />
                      ),
                    },
                  ],
                },
                // 3. 解析模板 - 4 tools
                {
                  title: "解析模板：读取模板文件并明确章节映射规则",
                  status: "success",
                  items: [
                    {
                      content: "解析模板，我将调用文档解析工具",
                    },
                    {
                      toolCall: {
                        icon: <FileText className="size-3" />,
                        title: "文档解析",
                        content:
                          "现在我要开始解析模板，系统开始读取用户选择的「01--3.Chinese_CSR_v2.0_09Dec11 2 -SAMPLE-empty templet」",
                      },
                    },
                    {
                      content: "解析模板，我将调用章节识别工具",
                    },
                    {
                      toolCall: {
                        icon: <Database className="size-3" />,
                        title: "章节识别",
                        content:
                          "现在开始抽取模板文件的所有章节，并解析章节层级，确保获取到的目录结构正确，并建立章节树",
                      },
                    },
                    {
                      content: "解析模板，我将调用章节处理策略工具",
                    },
                    {
                      toolCall: {
                        icon: <LayoutList className="size-3" />,
                        title: "章节处理策略",
                        content:
                          "将章节映射至对应的 ICH E3 / 等监管指南条款，明确该章节的合规定位与必填属性。",
                      },
                    },
                    {
                      content: "解析模板，我将调用语义匹配工具",
                    },
                    {
                      toolCall: {
                        icon: <MessageSquare className="size-3" />,
                        title: "语义匹配",
                        content: "判断是否存在与当前章节高度相似或可直接复用的段落，并给出相似度评分",
                      },
                    },
                  ],
                },
                // 4. 多源材料解析 - 8 tools
                {
                  title: "多源材料解析：解析数据来源并进行关键信息提取",
                  status: "success",
                  items: [
                    {
                      content: "解析模板，我将调用文档解析工具",
                    },
                    {
                      toolCall: {
                        icon: <FileText className="size-3" />,
                        title: "文档解析",
                        content: "首先我需要解析 「01-01.PRT_Ver1CH__Chinese - less SAMPLE」 文件",
                      },
                    },
                    {
                      content: "解析模板，我将调用章节解析工具",
                    },
                    {
                      toolCall: {
                        icon: <Database className="size-3" />,
                        title: "章节解析",
                        content: "已获取标题结构、段落编号、小节标题",
                      },
                    },
                    {
                      content: "解析模板，我将调用文档解析工具",
                    },
                    {
                      toolCall: {
                        icon: <FileText className="size-3" />,
                        title: "文档解析",
                        content: "接下来我需要解析「01-02.SAP - SAMPLE」文件：",
                      },
                    },
                    {
                      content: "解析模板，我将调用章节解析工具",
                    },
                    {
                      toolCall: {
                        icon: <Database className="size-3" />,
                        title: "章节解析",
                        content: "已获取标题结构、段落编号、小节标题",
                      },
                    },
                    {
                      content: "解析模板，我将调用文档解析工具",
                    },
                    {
                      toolCall: {
                        icon: <FileText className="size-3" />,
                        title: "文档解析",
                        content: "现在我需要利用多模态模型针对 99 个rtf格式文件进行解析：",
                      },
                    },
                    {
                      content: "解析模板，我将调用章节解析工具",
                    },
                    {
                      toolCall: {
                        icon: <LayoutList className="size-3" />,
                        title: "章节解析",
                        content:
                          "已进行RTF格式解析、正在自动生成「结构化TFL表征」、正在理解图表内容",
                      },
                    },
                    {
                      content: "解析模板，我将调用文档解析工具",
                    },
                    {
                      toolCall: {
                        icon: <FileText className="size-3" />,
                        title: "文档解析",
                        content: "最后我需要对S1、S2、S3、S4文件进行解析",
                      },
                    },
                    {
                      content: "解析模板，我将调用章节解析工具",
                    },
                    {
                      toolCall: {
                        icon: <Database className="size-3" />,
                        title: "章节解析",
                        content:
                          "正在校验格式、正在验证是否存在丢失字段，已成功将文件识别为模板12 附录章节",
                      },
                    },
                  ],
                },
                // 5. 任务编排 - 4 tools
                {
                  title: "任务编排：明确每个章节的章节处理策略，构建任务列表，并完成任务分配",
                  status: "success",
                  items: [
                    {
                      content: "解析模板，我将调用章节定位工具",
                    },
                    {
                      toolCall: {
                        icon: <Database className="size-3" />,
                        title: "章节定位",
                        content:
                          "在「01--3.Chinese_CSR_v2.0_09Dec11 2 -SAMPLE-empty templet」模板文件中定位当前待处理章节",
                      },
                    },
                    {
                      content: "解析模板，我将调用文档检索工具",
                    },
                    {
                      toolCall: {
                        icon: <Search className="size-3" />,
                        title: "文档检索",
                        content: "基于模板文件的章节段落",
                      },
                    },
                    {
                      content: "解析模板，我将调用相似度与可复用性评估工具",
                    },
                    {
                      toolCall: {
                        icon: <LayoutList className="size-3" />,
                        title: "相似度与可复用性评估",
                        content: "对每个候选来源计算相似度与复用等级（可直接复制/需改写/需补充/不可用）",
                      },
                    },
                    {
                      content: "解析模板，我将调用冲突与风险提示工具",
                    },
                    {
                      toolCall: {
                        icon: <AlertTriangle className="size-3" />,
                        title: "冲突与风险提示",
                        content:
                          "当出现多来源高相似、或来源间关键字段冲突（样本量/时间窗/终点定义等）时，生成风险提示与推荐选择。",
                      },
                    },
                  ],
                },
                // 6. 报告整合 - 1 tool
                {
                  title: "报告整合：梳理并行生成的子报告，并按照模板文件的章节架构进行报告整合",
                  status: "success",
                  items: [
                    {
                      content: "解析模板，我将调用CSR报告组装编排工具工具",
                    },
                    {
                      toolCall: {
                        icon: <Globe className="size-3" />,
                        title: "CSR报告组装编排工具",
                        content:
                          "接下来将进行报告整合，我需要将所有复制内容、受控内容生成的子文档按照文档章节架构进行梳理。",
                      },
                    },
                  ],
                },
              ],
            },
          ]}
        />
      </ThinkingProcessContainerPrimitive>

      {/* 思考结束后 - 3 个节点 */}
      <Markdown content="您可以点击报告卡片查阅或修改已生成的 IC-265 CSR临床试验报告，已自动化为您保存。" />
      <ReportCard
        title="IC - 265_CSR 报告"
        description="更新时间：18:21"
        icon={<FlaskConical className="size-4 text-[var(--Text-text-brand)]" />}
        showAction={false}
        width="100%"
      />
      <Markdown content="报告模板中的「10.2.4 治疗期」章节缺少必要的统计分析文件信息，无法一次性生成完成，建议邀请「统计专家」进入工作空间，补充必要性材料后继续。" />
    </div>
  ),
  feedback: (
    <div className="flex flex-col gap-[var(--Gap-gap-md)]">
      <MessageFeedbackActions role="ai" align="left" />
      <SuggestionPanel items={SUGGESTIONS} className="flex flex-wrap justify-start gap-2" />
    </div>
  ),
};

export function ChatPanel() {
  const [inputValue, setInputValue] = React.useState("");

  const handleSend = React.useCallback(() => {
    if (!inputValue.trim()) return;
    setInputValue("");
  }, [inputValue]);

  return (
    <div
      data-slot="chat-panel"
      className={cn(
        "flex flex-col h-full",
        "bg-[var(--Container-bg-container)]",
        "rounded-[var(--radius-xl)]",
      )}
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageList
          messages={[USER_MESSAGE, AI_MESSAGE]}
          className="h-full px-4 py-4"
          showDefaultFeedback={false}
          renderContent={(content) => content}
        />
      </div>

      <div className="shrink-0 border-t border-[var(--Border-divider-neutral-basic)] p-4">
        <ResponsiveSender
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          placeholder="请输入"
          submitOnEnter
        />
      </div>
    </div>
  );
}
