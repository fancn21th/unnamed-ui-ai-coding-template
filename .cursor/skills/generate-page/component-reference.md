# 组件库 API 参考

本文档提供每个组件的导入方式和关键 Props，供生成页面时查阅。
如需更详细的 API，直接阅读对应源码文件。

## 使用顺序（建议）

1. 先查 **布局组件**（页面骨架）
2. 再查 **业务组件**（消息/表单/卡片/任务等）
3. 最后查 **shadcn 与 blocks**（补细节）

如果你在做「高还原页面」，优先保证布局和交互入口一致，再做视觉细节对齐。

## 场景速查表

| 场景 | 首选组件 |
|------|----------|
| 页头 | PageHeader |
| 三栏布局 | TripleSplitPane |
| 侧边导航 | Sidebar |
| 对话输入 | ComposedSender / ResponsiveSender |
| AI/用户消息 | AIMessage / UserMessage |
| 消息列表 | MessageList |
| 欢迎/空态 | Welcome |
| 提示词 | Prompt |
| 表单输入 | BlockInput / BlockSelect |
| 动态表单 | DynamicForm |
| 文件上传 | Upload |
| 卡片展示 | FileCard / DocumentCard / AgentCard / TaskCard / ReportCard |
| 任务列表 | TaskList |
| 进度展示 | Progress |
| 状态标签 | StatusTag / Tag |
| 弹层确认 | ConfirmPanel |
| Markdown 渲染 | Markdown |

## 导入路径速查

| 组件 | 导入路径 |
|------|----------|
| PageHeader | `@/components/wuhan/composed/page-header` |
| TripleSplitPane | `@/components/wuhan/composed/triple-split-pane` |
| Sidebar | `@/components/wuhan/composed/sidebar` |
| ComposedSender | `@/components/wuhan/composed/sender` |
| AIMessage, UserMessage | `@/components/wuhan/composed/message` |
| MessageList | `@/components/wuhan/composed/message-list` |
| BlockButton | `@/components/wuhan/composed/block-button` |
| BlockInput | `@/components/wuhan/composed/block-input` |
| BlockSelect | `@/components/wuhan/composed/block-select` |
| Button | `@/components/ui/button` |
| Input | `@/components/ui/input` |
| Tabs | `@/components/ui/tabs` |
| cn | `@/lib/utils` |
| 图标 | `lucide-react` |

---

## 布局组件

### PageHeader

```tsx
import { PageHeader, PageHeaderUser, PageHeaderButtonGroup } from "@/components/wuhan/composed/page-header";

<PageHeader
  logo={<img src="/logo.svg" />}   // ReactNode
  title="页面标题"                   // ReactNode
  actions={                          // 右侧操作区
    <>
      <PageHeaderUser name="用户名" avatarSrc="/avatar.jpg" onClick={() => {}} />
    </>
  }
/>
```

### TripleSplitPane

三栏可拖拽可折叠布局，适用于「侧边栏 + 主内容 + 辅助面板」结构。

```tsx
import { TripleSplitPane } from "@/components/wuhan/composed/triple-split-pane";

<TripleSplitPane
  className="w-full flex-1 overflow-hidden"
  left={{
    title: "左栏标题",
    width: "240px",
    collapsedWidth: "0px",
    minWidth: "240px",
    children: <div>左栏内容</div>,
    classNames: { body: "px-2 py-4" },
  }}
  leftPopover={{
    enabled: true,
    width: "240px",
    height: "520px",
    content: <div>折叠后弹出内容</div>,
  }}
  center={{
    title: "中栏标题",
    minWidth: "280px",
    children: <div>主内容</div>,
  }}
  right={{
    title: "右栏标题",
    width: "360px",
    collapsedWidth: "48px",
    minWidth: "360px",
    children: <div>右栏内容</div>,
  }}
/>
```

### Sidebar

```tsx
import { Sidebar } from "@/components/wuhan/composed/sidebar";
```

---

## 消息与对话组件

### AIMessage / UserMessage

```tsx
import { AIMessage, UserMessage } from "@/components/wuhan/composed/message";

<AIMessage status="idle">AI 回复内容</AIMessage>
<AIMessage status="generating" generatingContent={<LoadingDots />} />
<AIMessage status="failed" errorMessage="生成失败" />
<UserMessage>用户消息</UserMessage>
```

Props: `status?: "idle" | "generating" | "failed"`, `errorMessage?`, `generatingContent?`, `errorContent?`

### MessageList

```tsx
import { MessageList } from "@/components/wuhan/composed/message-list";
```

### MessageFeedbackActions

```tsx
import { MessageFeedbackActions } from "@/components/wuhan/composed/message";
```

### ComposedSender

消息输入组件，支持附件、模式切换、发送。

```tsx
import { ComposedSender } from "@/components/wuhan/composed/sender";

<ComposedSender
  value={inputValue}
  onChange={setInputValue}
  placeholder="输入消息..."
  onSend={handleSend}
  generating={isGenerating}
  submitOnEnter
  attachments={attachments}
  onAttach={handleAttach}
  onAttachmentRemove={handleRemove}
  modes={[{ id: "deep", label: "深度思考", icon: Brain }]}
  selectedModes={selectedModes}
  onModeChange={handleModeChange}
/>
```

### ResponsiveSender

```tsx
import { ResponsiveSender } from "@/components/wuhan/composed/responsive-sender";
```

### Welcome

```tsx
import { Welcome } from "@/components/wuhan/composed/welcome";
```

### Prompt

```tsx
import { Prompt } from "@/components/wuhan/composed/prompt";
```

### QuickAction

```tsx
import { QuickAction } from "@/components/wuhan/composed/quick-action";
```

### Suggestion

```tsx
import { Suggestion } from "@/components/wuhan/composed/suggestion";
```

---

## 思考与执行组件

### DeepThinking

```tsx
import { DeepThinking } from "@/components/wuhan/composed/deep-thinking";
```

### ThinkingProcess

```tsx
import { ThinkingProcess } from "@/components/wuhan/composed/thinking-process";
```

### ThinkingStepItem

```tsx
import { ThinkingStepItem } from "@/components/wuhan/composed/thinking-step-item";
```

### ExecutionResult

```tsx
import { ExecutionResult } from "@/components/wuhan/composed/execution-result";
```

---

## 表单组件

### BlockInput

```tsx
import { BlockInput } from "@/components/wuhan/composed/block-input";
```

### BlockSelect

```tsx
import { BlockSelect } from "@/components/wuhan/composed/block-select";
```

### Checkbox

```tsx
import { Checkbox } from "@/components/wuhan/composed/checkbox";
```

### Radio

```tsx
import { Radio } from "@/components/wuhan/composed/radio";
```

### DynamicForm

基于 JSON Schema 的动态表单。

```tsx
import { DynamicForm } from "@/components/wuhan/composed/dynamic-form";
```

### Upload

```tsx
import { Upload } from "@/components/wuhan/composed/upload";
```

---

## 按钮组件

### BlockButton

wuhan 按钮系统，支持 variant（solid/text/outline/link）和 color（brand/secondary/success/warning/error）。

```tsx
import { BlockButton } from "@/components/wuhan/composed/block-button";
```

### IconButton

```tsx
import { IconButton } from "@/components/wuhan/composed/icon-button";
```

### ToggleButton

```tsx
import { ToggleButton } from "@/components/wuhan/composed/toggle-button";
```

### shadcn Button

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">默认</Button>
<Button variant="outline">描边</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="secondary">次要</Button>
<Button variant="destructive">危险</Button>
<Button variant="link">链接</Button>
<Button size="sm">小</Button>
<Button size="icon"><Icon /></Button>
```

---

## 卡片组件

### AgentCard

```tsx
import { AgentCard } from "@/components/wuhan/composed/agent-card";
```

### FileCard

```tsx
import { FileCard } from "@/components/wuhan/composed/file-card";
```

### DocumentCard

```tsx
import { DocumentCard } from "@/components/wuhan/composed/document-card";
```

### TaskCard / TaskList

```tsx
import { TaskCard } from "@/components/wuhan/composed/task-card";
import { TaskList } from "@/components/wuhan/composed/task-list";
```

### GoalCard

```tsx
import { GoalCard } from "@/components/wuhan/composed/goal-card";
```

### ReportCard

```tsx
import { ReportCard } from "@/components/wuhan/composed/report-card";
```

### SelectCard

```tsx
import { SelectCard } from "@/components/wuhan/composed/select-card";
```

---

## 展示组件

### Avatar

```tsx
import { Avatar } from "@/components/wuhan/composed/avatar";
```

### AvatarHeader

```tsx
import { AvatarHeader } from "@/components/wuhan/composed/avatar-header";
```

### Progress

支持线形和环形进度。

```tsx
import { Progress } from "@/components/wuhan/composed/progress";
```

### StatusTag

```tsx
import { StatusTag } from "@/components/wuhan/composed/status-tag";
```

### Tag

```tsx
import { Tag } from "@/components/wuhan/composed/tag";
```

### Tooltip

```tsx
import { Tooltip } from "@/components/wuhan/composed/tooltip";
```

### Divider

```tsx
import { Divider } from "@/components/wuhan/composed/divider";
```

### BlockAccordion

```tsx
import { BlockAccordion } from "@/components/wuhan/composed/block-accordion";
```

### Feedback

```tsx
import { Feedback } from "@/components/wuhan/composed/feedback";
```

### HistoryItem

```tsx
import { HistoryItem } from "@/components/wuhan/composed/history-item";
```

### ConfirmPanel

```tsx
import { ConfirmPanel } from "@/components/wuhan/composed/confirm-panel";
```

### ComponentPanel

```tsx
import { ComponentPanel } from "@/components/wuhan/composed/component-panel";
```

### AttachmentList

```tsx
import { AttachmentListComposed } from "@/components/wuhan/composed/attachment-list";
```

### Markdown

```tsx
import { Markdown } from "@/components/wuhan/composed/markdown";
```

---

## shadcn UI 基础组件

| 组件 | 导入 |
|------|------|
| Button | `@/components/ui/button` |
| Input | `@/components/ui/input` |
| Textarea | `@/components/ui/textarea` |
| Label | `@/components/ui/label` |
| Select | `@/components/ui/select` |
| Tabs | `@/components/ui/tabs` |
| Switch | `@/components/ui/switch` |
| Slider | `@/components/ui/slider` |
| Separator | `@/components/ui/separator` |
| Popover | `@/components/ui/popover` |
| Collapsible | `@/components/ui/collapsible` |
| Resizable | `@/components/ui/resizable` |
| Field | `@/components/ui/field` |

---

## 关键组件注意点

| 组件 | 注意 |
|------|------|
| **ComposedSender** | 必须传 `value` + `onChange` + `onSend`；`generating` 时显示加载态；`submitOnEnter` 可开启回车发送 |
| **TripleSplitPane** | `left`/`center`/`right` 均需 `children`；`left`/`right` 需 `width`+`minWidth`+`collapsedWidth`；`leftPopover.enabled` 折叠后弹出 |
| **AIMessage** | `status="generating"` 时用 `generatingContent` 自定义加载；`status="failed"` 时用 `errorMessage` 或 `errorContent` |
| **PageHeader** | `actions` 可放 `PageHeaderUser`、`PageHeaderButtonGroup`；logo 建议 24–32px |
| **DynamicForm** | 基于 JSON Schema，需传入 schema 与 onSubmit |
| **Markdown** | 内部已用 antd Skeleton，页面层勿再引入 antd |

---

## blocks 原语层

当 composed 组件不满足需求时，可直接使用 blocks 原语进行更灵活的组合。
blocks 位于 `@/components/wuhan/blocks/`，命名格式 `*-01.tsx`。
导出名称使用 `*Primitive` 后缀。

查看具体 blocks API 时，直接阅读对应源码文件。
