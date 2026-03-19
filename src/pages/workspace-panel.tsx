"use client";

import * as React from "react";
import {
  PenLine,
  FileSearch,
  Clock,
  Bell,
  FileText,
  FileEdit,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Accordion, AccordionItem } from "@/components/wuhan/composed/block-accordion";
import { Button } from "@/components/wuhan/composed/block-button";
import { GoalCard } from "@/components/wuhan/composed/goal-card";
import { ReportCard } from "@/components/wuhan/composed/report-card";
import { Avatar } from "@/components/wuhan/composed/avatar";
import { Divider } from "@/components/wuhan/composed/divider";
import { cn } from "@/lib/utils";

// Agent 卡片数据（按 Figma 设计稿颜色：绿/蓝/紫/青/薰衣草/青绿）
const AGENT_ITEMS = [
  { id: "1", title: "撰写岗位JD", icon: <PenLine className="size-4" />, bg: "var(--Light-Success-success-100)" },
  { id: "2", title: "简历初筛评估评", icon: <FileSearch className="size-4" />, bg: "var(--Light-Brand-brand-100)" },
  { id: "3", title: "面试时间推荐", icon: <Clock className="size-4" />, bg: "var(--workspace-agent-purple)" },
  { id: "4", title: "面试会邀及通知", icon: <Bell className="size-4" />, bg: "var(--workspace-agent-cyan)" },
  { id: "5", title: "生成面试题", icon: <FileText className="size-4" />, bg: "var(--workspace-agent-lavender)" },
  { id: "6", title: "生成面试题", icon: <FileEdit className="size-4" />, bg: "var(--workspace-agent-teal)" },
] as const;

const COLLABORATORS = ["陈一", "陈一", "陈一", "陈一", "陈一", "陈一"];

export function WorkspacePanel() {
  return (
    <div
      data-slot="workspace-panel"
      className={cn(
        "flex flex-col",
        "bg-[var(--Page-bg-page)]",
        "h-full overflow-hidden relative",
      )}
      style={
        {
          "--workspace-agent-purple": "#f8f0ff",
          "--workspace-agent-cyan": "#ebf8fe",
          "--workspace-agent-lavender": "#f4f3ff",
          "--workspace-agent-teal": "#eafbfa",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex-1 overflow-y-auto",
          "p-[var(--Padding-padding-com-xl)]",
          "pb-24",
        )}
      >
        <Accordion type="multiple" expandAll>
          <AccordionItem
            value="goals"
            trigger={
              <SectionTrigger title="工作目标：" count={2} />
            }
            content={
              <>
                <div className="flex flex-col gap-[var(--Gap-gap-lg)] pt-2 min-w-0">
                  <GoalCard
                    title="IC - 265_CSR 报告生成IC - 265_CSR 报告生成"
                    progress={0}
                    icon={<FileText className="size-5 text-[var(--Text-text-brand)]" />}
                    size="md"
                    className="overflow-hidden min-w-0 [&>div:first-child]:min-w-0"
                  />
                  <GoalCard
                    title="IC - 265_CSR 报告生成IC - 265_CSR 报告生成"
                    progress={0}
                    icon={<FileText className="size-5 text-[var(--Text-text-brand)]" />}
                    size="md"
                    className="overflow-hidden min-w-0 [&>div:first-child]:min-w-0"
                  />
                </div>
                <Divider className="my-[var(--Gap-gap-xl)]" />
              </>
            }
          />
          <AccordionItem
            value="collaborators"
            trigger={
              <SectionTrigger title="已邀请协作者：" count={6} />
            }
            content={
              <>
                <div className="flex flex-wrap gap-[var(--Gap-gap-md)] content-center pt-2">
                  {COLLABORATORS.map((name, i) => (
                    <Avatar
                      key={i}
                      size="lg"
                      className="bg-[var(--Container-bg-brand-light-hover)] shrink-0"
                    >
                      <span className="text-[var(--Text-text-brand)] font-size-2">
                        {name}
                      </span>
                    </Avatar>
                  ))}
                </div>
                <Divider className="my-[var(--Gap-gap-xl)]" />
              </>
            }
          />
          <AccordionItem
            value="agents"
            trigger={<SectionTrigger title="Agent" />}
            content={
              <>
                <div className="grid grid-cols-2 gap-[var(--Gap-gap-md)] pt-2">
                  {AGENT_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex flex-col gap-[var(--Gap-gap-xs)]",
                        "p-[var(--Padding-padding-com-lg)]",
                        "rounded-[var(--radius-xl)]",
                        "border border-[var(--Border-border-neutral)]",
                      )}
                      style={{ backgroundColor: item.bg }}
                    >
                      <div className="text-[var(--Text-text-brand)] shrink-0">
                        {item.icon}
                      </div>
                      <p
                        className={cn(
                          "font-[var(--font-family-CN)] font-size-2 leading-[var(--line-height-2)]",
                          "text-[var(--Text-text-primary)]",
                          "overflow-hidden text-ellipsis whitespace-nowrap",
                        )}
                      >
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
                <Divider className="my-[var(--Gap-gap-xl)]" />
              </>
            }
          />
          <AccordionItem
            value="results"
            trigger={<SectionTrigger title="工作结果" />}
            content={
              <div className="pt-2">
                <ReportCard
                  title="候选人能力评估报告评估报告 · 张怡"
                  description="更新时间：2分钟前"
                  icon={<TrendingUp className="size-4 text-[var(--Text-text-brand)]" />}
                  showAction={false}
                  width="100%"
                />
              </div>
            }
          />
        </Accordion>
      </div>

      {/* 底部固定按钮 */}
      <div className="absolute bottom-[var(--Padding-padding-com-xl)] left-1/2 -translate-x-1/2 shrink-0">
        <Button
          variant="solid"
          color="primary"
          size="md"
          icon={<Plus className="size-4" />}
          className="rounded-full h-8 px-[var(--Padding-padding-com-xl)]"
        >
          添加笔记
        </Button>
      </div>
    </div>
  );
}

interface SectionTriggerProps {
  title: string;
  count?: number;
}

function SectionTrigger({ title, count }: SectionTriggerProps) {
  return (
    <span className="font-size-2 leading-[var(--line-height-2)]">
      <span className="text-[var(--Text-text-secondary)]">{title}</span>
      {count !== undefined && (
        <span className="text-[var(--Text-text-primary)]">{count}</span>
      )}
    </span>
  );
}
