---
name: generate-page
description: >-
  基于项目组件库和设计系统生成页面。当用户要求创建页面、实现界面、开发功能模块、
  根据需求文档/PRD/设计稿生成 UI，或提到"生成页面""创建页面""实现界面""做一个页面"时使用此技能。
---

# 基于组件库生成页面

## 目标

在最少返工下，生成「高还原 + 高一致性」的页面代码：结构先对齐，组件再对齐，样式最后对齐。

## 需求不明确时

若用户描述模糊，先输出以下澄清问题（可简写）：

1. 页面主要做什么？（对话/管理/表单/展示）
2. 布局是几栏？（单栏/双栏/三栏）
3. 有无侧边栏或弹层？
4. 需要哪些核心操作？（创建/编辑/删除/筛选/导出）

## 强制流程（不可跳步）

### Step 1: 拆解需求

先输出 4 项结论（可简写）：

- 页面类型（工作台/表单/详情/列表/仪表盘）
- 布局结构（单栏/双栏/三栏）
- 主任务流（用户从哪进入，到哪结束）
- 状态集合（normal/loading/empty/error）

### Step 2: 先蓝图后编码

查阅 [component-reference.md](component-reference.md)，按顺序执行。需要具体代码参考时，见 [examples.md](examples.md)。

1. 确定布局骨架（PageHeader / Sidebar / TripleSplitPane）
2. 确定业务组件（消息、卡片、表单、上传、报告等）
3. 查阅各组件 API 与最佳实践
4. 确认设计 token（text/container/border/spacing）

### Step 3: 组件选型优先级

`wuhan composed > wuhan blocks > shadcn ui > 自定义容器样式`

禁止从零手写按钮/输入框/选择器/弹层等基础控件。

### Step 4: 页面实现顺序

1. 骨架层：PageHeader / Sidebar / TripleSplitPane
2. 内容层：消息、卡片、表单、上传、报告等业务组件
3. 行为层：事件处理、状态切换、边界态
4. 视觉层：token 和语义类微调（不破坏组件原始视觉）

### Step 5: 生成后审查

按下方质量闸门清单逐项检查。

## 最小页面模板

```tsx
"use client";

import * as React from "react";
import { PageHeader } from "@/components/wuhan/composed/page-header";
import { cn } from "@/lib/utils";

export function MyPage() {
  return (
    <div className={cn("h-full flex flex-col overflow-hidden", "bg-[var(--Container-bg-neutral-light)]")}>
      <PageHeader title="页面标题" />
      <main className="flex-1 overflow-auto p-4">
        {/* 内容区 */}
      </main>
    </div>
  );
}
```

## 输出代码约束

- 文件放在 `src/pages/`；文件名使用 kebab-case（如 `chat-page.tsx`）
- 使用 `@/` 别名导入
- 图标仅用 `lucide-react`
- 样式优先语义 token 与组件变体
- 类型完整，避免 `any`

## 质量闸门（必须通过）

- [ ] 至少使用 3 个 composed 组件
- [ ] 不包含 `@mui/*`、`antd`、`chakra-ui` 等外部 UI 库
- [ ] 不包含硬编码颜色（`#hex`, `rgb`, `hsl`）
- [ ] 有 `loading` 与 `empty/error` 状态
- [ ] 布局结构与设计稿一致（栏位与滚动边界一致）

## 常见出错点（避免）

- **ComposedSender**：必须同时传 `value` + `onChange` + `onSend`，否则无法发送
- **TripleSplitPane**：`left`/`right` 需 `children`，`center` 需 `minWidth`，否则布局错乱
- **背景色**：页面根用 `bg-[var(--Container-bg-neutral-light)]` 或 `bg-[var(--Page-bg-page)]`
- **antd**：部分 composed 内部已用 antd（如 Markdown 的 Skeleton），页面层勿直接 `import antd`

## 常见页面模式

| 页面模式 | 推荐组件组合 |
|----------|------------|
| AI 对话页 | PageHeader + TripleSplitPane + MessageList + ComposedSender + Prompt |
| AI Agent 页 | PageHeader + AgentCard + TaskList + GoalCard + ExecutionResult |
| 数据源管理 | Sidebar + FileCard/DocumentCard + Upload + DynamicForm |
| 设置/表单页 | PageHeader + BlockInput + BlockSelect + Checkbox + Radio + DynamicForm |
| 仪表盘 | PageHeader + ReportCard + Progress + StatusTag + Tabs |
| 历史记录 | Sidebar + HistoryItem + MessageList |
