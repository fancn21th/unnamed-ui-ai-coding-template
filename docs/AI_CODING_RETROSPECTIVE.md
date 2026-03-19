# AI Coding 搭建对话页面：回顾与反思

> 本文档总结在 AI Coding 模式下搭建「AI 对话」页面的过程，记录人类指导修正的内容，并提出改进建议与替代方案。
>
> 简要总结版见 [AI_CODING_EXECUTIVE_SUMMARY.md](./AI_CODING_EXECUTIVE_SUMMARY.md)。

---

## 〇、项目基础设施（开发前提）

本次开发基于一套已搭建好的 AI 开发基础设施，这些设施显著影响了生成质量与修正成本：

| 基础设施 | 说明 |
|----------|------|
| **组件模板** | 项目为基于 wuhan 组件库的 AI 应用 UI 模板，包含完整设计系统（设计 token、组件体系） |
| **预设 UWS 布局** | 三栏布局（数据来源 \| 对话 \| 工作空间）已就绪，PageHeader、TripleSplitPane 等骨架可直接使用 |
| **Cursor Rules** | `.cursor/rules/` 下配置了项目概述、组件使用、设计 token、页面生成质量等规则，AI 生成时自动遵循 |
| **Cursor Skills** | `generate-page` 技能：需求拆解 → 蓝图 → 组件选型 → 实现顺序，标准化页面生成流程 |
| **组件库 MCP** | `wuhan-components` MCP Server 可查询组件 API、最佳实践、设计 token，AI 能直接查阅而非猜测 |
| **Figma MCP** | 本地 Figma Desktop MCP 可获取设计稿节点、截图、设计上下文，提升设计还原效率 |

有 Figma 参考时，空状态、布局等修正更少；组件库 MCP 减少了组件用法类错误；规则与 Skill 约束了技术栈与编码风格。

---

## 一、人类指导修正内容总结

在本次开发中，用户对 AI 生成结果进行了多轮修正，主要涉及以下几类问题：

### 1. 初始状态与空状态设计

| 问题 | 修正内容 |
|------|----------|
| 预设用户消息 | 界面初始加载时不应出现预设的用户消息，应保持消息列表为空 |
| 空状态 UI | 按 Figma 设计稿实现：居中欢迎区（Logo + 标语）、建议入口（可点击发送的 Suggestion 按钮） |
| MessageList 扩展 | 新增 `emptyContent` prop，支持自定义空状态内容 |

### 2. AI 消息不显示（Bug 修复）

| 问题 | 修正内容 |
|------|----------|
| 发送后无 AI 回复 | `AIMessage` 在 `status="generating"` 时优先使用 `generatingContent`，未传入时显示 `null`。需在生成中状态显式传入流式内容到 `generatingContent` |

### 3. 状态与流程逻辑

| 问题 | 修正内容 |
|------|----------|
| ThinkingStep 状态 | 不应一开始就显示「思考完成」，应根据阶段显示「思考中」/「思考完成」 |
| 步骤间无延时 | 各子步骤（如「查找符合监管要求的模板文件，我将调用数据来源查询工具」）需有延时，不能一次性全部出现 |
| 子步骤状态 | 每个 ThinkingStepItem 需有独立的 loading/success 状态 |
| 报告总结无打字机效果 | 报告前后的说明文案需支持流式输出 |

### 4. 步骤完成时机

| 问题 | 修正内容 |
|------|----------|
| 确定模板 / 明确数据来源 | 父步骤在子步骤未全部完成时就显示 success，需改为：在整个步骤 phase 范围内保持 loading |
| 解析模板及后续步骤 | 每个步骤内的子项（content、toolCall、files）一次性出现，需改为分批逐步出现 |
| 报告整合 | 流程结束后该步骤仍显示 loading，需在 `isDone` 或进入 report 阶段后显示 success |

### 5. 体验调优

| 问题 | 修正内容 |
|------|----------|
| 节奏过快 | 提高延时参数：ITEM_DELAY、TOOL_DELAY、STEP_DELAY |

---

## 二、如何减少人类指导修正

### 2.1 提供更完整的前置信息

- **设计稿 / Figma**：明确引用节点 ID，说明空状态、加载态、完成态等关键界面。项目已配置 Figma MCP，AI 可直接调用 `get_design_context` 获取设计上下文
- **交互时序**：用文字或时序图描述「流式输出 → 阻塞等待 → 继续」的完整流程
- **状态约束**：明确「父步骤在子步骤未完成前不得显示 success」等规则

### 2.2 分阶段、分模块开发

- 先实现「空状态 + 发送 + 单条 AI 流式回复」的最小闭环
- 再逐步加入「阻塞点」「多步骤」「子项分批出现」等复杂度
- 每步验证通过后再扩展，避免一次性生成过大量代码

### 2.3 建立项目级约定

- 项目已有 `.cursor/rules`（project-overview、component-usage、design-tokens 等），可在此基础上补充：
  - 空状态、加载态、错误态的处理方式
  - 组件 `status` / `generatingContent` 等 props 的用法
  - 模拟逻辑与 UI 的解耦方式（如 `chat-simulation` 模块）

### 2.4 使用 Skill 沉淀经验

- 将「对话 mock 开发」整理为 Skill，包含：
  - 推荐目录结构（config / runner / hook / streaming-content）
  - 阶段类型（text / delay / block / instant）
  - 常见坑点（如 AIMessage 的 generatingContent）

---

## 三、对话 Mock 场景的效率提升建议

### 3.1 当前痛点

- 阶段多、状态多，配置与 UI 强耦合，易出错
- 人类需要反复描述「何时 loading、何时 success、何时流式」
- 对接真实 API 时，mock 逻辑往往需要重写

### 3.2 提升 Mock 效率的做法

| 方向 | 建议 |
|------|------|
| **配置驱动** | 用 JSON/YAML 描述阶段序列（id、type、content、delayMs、blockType），UI 只负责解析和渲染 |
| **状态机可视化** | 用状态图表达阶段流转，便于 AI 和人类理解，减少遗漏 |
| **Mock 与 API 同构** | 设计 `SimulationRunner` 与 `APIStreamRunner` 共享同一接口（如 `{ phaseId, content, isBlocked, onConfirm }`），切换时只换实现 |
| **录制回放** | 真实 API 调试时录制一次完整会话，导出为 mock 配置，用于前端自测 |

### 3.3 改变开发方式：更高效的前端对话开发

**思路：以「协议 + 渲染器」为中心，而非以「mock 实现」为中心**

1. **定义统一的对话协议**
   - 消息类型：`text`（流式）、`block`（阻塞）、`node`（自定义组件）
   - 事件：`stream_update`、`block_wait`、`block_confirm`、`done`
   - 后端 SSE/WebSocket 可输出同一协议，前端只做协议解析与渲染

2. **渲染器与数据源解耦**
   - `StreamingContentRenderer` 接收 `(events, onConfirm)`，不关心数据来自 mock 还是 API
   - Mock 用 `useChatSimulation` 产生事件，API 用 `useChatStream` 产生事件，两者输出格式一致

3. **Mock 作为协议实现**
   - Mock 本质是「按配置生成协议事件序列」
   - 配置可来自：手写 JSON、从设计稿解析、从录制会话导出
   - 对接 API 时，只需实现「协议事件 ← API 响应」的转换层

4. **工具支持**
   - 协议校验工具：检查 mock 输出是否符合协议
   - 可视化编辑器：拖拽配置阶段、延时、阻塞点，自动生成 config
   - 对比测试：同一输入下，mock 输出与 API 输出结构一致性的自动化检查

---

## 四、AI Coding 过程整体反思

### 4.1 做得好的点

- **模块化**：`chat-simulation` 独立于 UI，类型清晰（`SimulationPhase`、`ChatSimulationState`），便于维护和替换
- **配置化**：阶段序列集中在 `config.ts`，调整节奏、文案、阻塞点无需改核心逻辑
- **组件复用**：充分使用 wuhan 组件库（TaskList、ConfirmPanel、DynamicForm、ThinkingStep 等），风格统一
- **渐进修正**：用户反馈具体、可执行，AI 能快速定位并修复问题

### 4.2 做得不好的点

- **首次生成过于乐观**：未充分考虑空状态、generatingContent、步骤状态等细节，导致多轮返工
- **阶段与 UI 强耦合**：`streaming-content.tsx` 中大量 phaseIndex 硬编码，新增阶段需同步修改多处
- **文档滞后**：开发过程中未及时补充「阶段含义」「状态映射」等说明，不利于后续接手

### 4.3 其他观察

- **对话 mock 的复杂度被低估**：流式、阻塞、多步骤、子项分批、状态联动，组合起来复杂度高，适合用「协议 + 状态机」系统化建模
- **设计稿的价值**：有 Figma 参考时（配合 Figma MCP 的 `get_design_context`），空状态、布局等修正更少；缺少设计稿时，AI 容易按通用模式生成，与预期偏差大
- **规则与 Skill 的边际收益**：项目规则（如 `project-overview.mdc`）对技术栈、组件体系有帮助；组件库 MCP 可减少组件用法类错误；若增加「对话 mock 开发约定」类规则或 Skill，有望减少重复性修正

---

## 五、附录：本次实现的关键结构

```
src/
├── lib/chat-simulation/
│   ├── types.ts      # SimulationPhase, delay/block/text/instant
│   ├── config.ts     # CSR_REPORT_PHASES 阶段配置
│   ├── runner.ts     # streamText, delay
│   ├── use-chat-simulation.ts  # 阶段推进、阻塞等待、confirmBlock
│   └── index.ts
├── pages/
│   ├── chat-panel.tsx           # 主面板、发送、空状态
│   └── chat-panel/
│       └── streaming-content.tsx  # 根据 state 构建 AI 消息内容
```

**阶段类型**：`text`（流式）、`delay`（延时）、`block`（阻塞等待用户确认）、`instant`（立即进入下一阶段）

**状态驱动**：`phaseIndex`、`phaseId`、`isStreaming`、`isBlocked`、`isDone` 共同决定 UI 展示与交互。
