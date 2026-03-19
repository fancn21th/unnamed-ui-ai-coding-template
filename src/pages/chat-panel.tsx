"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import {
  MessageList,
  type AIMessageItem,
  type UserMessageItem,
} from "@/components/wuhan/composed/message-list";
import { MessageFeedbackActions } from "@/components/wuhan/composed/message";
import { SuggestionPanel } from "@/components/wuhan/composed/suggestion";
import { ResponsiveSender } from "@/components/wuhan/composed/responsive-sender";
import { useChatSimulation } from "@/lib/chat-simulation";
import { buildStreamingContent } from "@/pages/chat-panel/streaming-content";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { id: "1", label: "介绍一下人工智能如何识别和行业相关的标准" },
  { id: "2", label: "如何评估 AI 生成报告的质量？" },
  { id: "3", label: "CSR 报告需要包含哪些核心章节？" },
];

const WELCOME_TAGLINE = "智能生成医药报告，让数据解读更高效，让科研决策更精准";

function buildFeedbackNode(onSuggestionClick: (label: string) => void) {
  return (
    <div className="flex flex-col gap-[var(--Gap-gap-md)]">
      <MessageFeedbackActions role="ai" align="left" />
      <SuggestionPanel
        items={SUGGESTIONS.map((s) => ({
          ...s,
          onClick: () => onSuggestionClick(String(s.label)),
        }))}
        className="flex flex-wrap justify-start gap-2"
      />
    </div>
  );
}

export function ChatPanel() {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<(UserMessageItem | AIMessageItem)[]>([]);

  const simulation = useChatSimulation();

  const sendText = React.useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setInputValue("");

      const userMsg: UserMessageItem = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: AIMessageItem = {
        id: aiMsgId,
        role: "ai",
        status: "generating",
        content: null,
      };
      setMessages((prev) => [...prev, aiMsg]);

      simulation.sendMessage();
    },
    [simulation],
  );

  const handleSend = React.useCallback(() => {
    sendText(inputValue);
  }, [inputValue, sendText]);

  const aiContent =
    simulation.isGenerating || simulation.isDone
      ? buildStreamingContent(
          {
            phaseIndex: simulation.phaseIndex,
            phaseId: simulation.phaseId,
            streamingText: simulation.streamingText,
            isStreaming: simulation.isStreaming,
            isBlocked: simulation.isBlocked,
            blockType: simulation.blockType,
            isDone: simulation.isDone,
            isGenerating: simulation.isGenerating,
          },
          simulation.confirmBlock,
        )
      : null;

  const lastAiIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "ai") return i;
    }
    return -1;
  })();
  const displayMessages = React.useMemo(() => {
    return messages.map((msg, index) => {
      if (msg.role === "ai" && index === lastAiIndex) {
        const isGenerating = !simulation.isDone;
        const content = aiContent ?? msg.content;
        return {
          ...msg,
          status: simulation.isDone ? "idle" : "generating",
          content,
          // AIMessage 在 status="generating" 时优先显示 generatingContent，需显式传入
          generatingContent: isGenerating ? content : undefined,
          feedback: simulation.isDone ? buildFeedbackNode(sendText) : undefined,
        };
      }
      return msg;
    });
  }, [messages, lastAiIndex, aiContent, simulation.isDone, sendText]);

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
          messages={displayMessages}
          className="h-full px-4 py-4"
          showDefaultFeedback={false}
          renderContent={(content) => content}
          emptyContent={
            <div
              data-slot="chat-empty-state"
              className={cn(
                "flex flex-col items-center justify-center gap-[var(--Gap-gap-2xl)]",
                "h-full px-4",
              )}
            >
              <div className="flex flex-col items-center gap-[var(--Gap-gap-lg)] max-w-[800px]">
                <div className="flex items-center gap-[var(--Gap-gap-lg)]">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-br from-[var(--Container-bg-brand)] to-[var(--Container-bg-brand)]/80">
                    <MessageSquare className="size-5 text-white" />
                  </div>
                  <p className="font-[var(--font-weight-600)] text-[var(--Text-text-title)] font-size-5 leading-[var(--line-height-5)]">
                    {WELCOME_TAGLINE}
                  </p>
                </div>
                <SuggestionPanel
                  items={SUGGESTIONS.map((s) => ({
                    ...s,
                    onClick: () => sendText(String(s.label)),
                  }))}
                  className="flex flex-wrap justify-center gap-[var(--Gap-gap-xl)]"
                />
              </div>
            </div>
          }
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
