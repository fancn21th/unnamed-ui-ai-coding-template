# 页面生成示例

## 示例 1：AI 对话页骨架

**输入**：做一个 AI 对话页面，左侧数据源、中间对话、右侧工作空间

**输出骨架**：

```tsx
"use client";

import * as React from "react";
import { PageHeader, PageHeaderUser } from "@/components/wuhan/composed/page-header";
import { TripleSplitPane } from "@/components/wuhan/composed/triple-split-pane";
import { ComposedSender } from "@/components/wuhan/composed/sender";
import { MessageList } from "@/components/wuhan/composed/message-list";
import { Welcome } from "@/components/wuhan/composed/welcome";
import { cn } from "@/lib/utils";

export function ChatPage() {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ id: string; role: "user" | "ai"; content: React.ReactNode }>>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className={cn("h-full flex flex-col overflow-hidden", "bg-[var(--Container-bg-neutral-light)]")}>
      <PageHeader title="智能助手" actions={<PageHeaderUser name="User" />} />
      <TripleSplitPane
        className="w-full flex-1 overflow-hidden"
        left={{ title: "数据来源", width: "240px", collapsedWidth: "0px", minWidth: "240px", children: <div>数据来源</div> }}
        leftPopover={{ enabled: true, width: "240px", height: "520px", content: <div>数据来源</div> }}
        center={{
          title: "对话",
          minWidth: "280px",
          children: (
            <div className="flex flex-col h-full">
              {messages.length === 0 ? <Welcome /> : <MessageList messages={messages} />}
              <ComposedSender value={input} onChange={setInput} onSend={handleSend} submitOnEnter />
            </div>
          ),
        }}
        right={{ title: "工作空间", width: "360px", collapsedWidth: "48px", minWidth: "360px", children: <div>工作空间</div> }}
      />
    </div>
  );
}
```

## 示例 2：表单页骨架

**输入**：做一个设置页面，包含用户昵称输入、主题选择、保存按钮

**输出骨架**：

```tsx
"use client";

import * as React from "react";
import { PageHeader } from "@/components/wuhan/composed/page-header";
import { BlockInput } from "@/components/wuhan/composed/block-input";
import { BlockSelect } from "@/components/wuhan/composed/block-select";
import { BlockButton } from "@/components/wuhan/composed/block-button";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const [nickname, setNickname] = React.useState("");
  const [theme, setTheme] = React.useState("light");

  return (
    <div className={cn("h-full flex flex-col overflow-hidden", "bg-[var(--Page-bg-page)]")}>
      <PageHeader title="设置" />
      <main className="flex-1 overflow-auto p-6 max-w-md">
        <div className="flex flex-col gap-4">
          <BlockInput value={nickname} onChange={setNickname} placeholder="请输入昵称" />
          <BlockSelect value={theme} onValueChange={setTheme} options={[{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }]} placeholder="选择主题" />
          <BlockButton variant="solid" color="brand" onClick={() => {}}>保存</BlockButton>
        </div>
      </main>
    </div>
  );
}
```

## 示例 3：状态处理模式

**loading**：用 `generating` 或条件渲染骨架/空内容

```tsx
{isLoading ? <div className="animate-pulse">加载中...</div> : <Content data={data} />}
```

**empty**：用 Welcome 或自定义空态。MessageList 的 `messages` 需为 `{ id, role, content }[]` 结构。

```tsx
{messages.length === 0 ? <Welcome /> : <MessageList messages={messages} />}
```

**error**：用 AIMessage 的 `status="failed"` 或自定义错误区

```tsx
<AIMessage status="failed" errorMessage="加载失败，请重试" />
```
