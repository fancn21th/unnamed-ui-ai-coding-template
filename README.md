# unnamed-demo2 · AI Coding 实验项目

本项目是 **AI Coding（AI 辅助编程）的测试与演示仓库**：在 **Cursor** 等工具中，以对话方式驱动开发，结合 **unnamed-ui（wuhan 组件库）**、**Cursor Rules / Skills**、**MCP（组件库 + Figma）** 等能力，**全程由 AI 主导编写** 一个典型的 **UWS（三栏工作台）** 页面与对话模拟流程。

> 目标不是「生产级产品」，而是验证：**在既定组件库与设计约束下，AI 能多好地落地复杂 UI、状态与文档沉淀**。

---

## 项目里有什么

| 内容 | 说明 |
|------|------|
| **UWS 布局** | 顶栏 + 三栏：`数据来源` \| `对话` \| `工作空间`（`TripleSplitPane` 等） |
| **对话面板** | 空状态、流式模拟回复、待办/选模板/补充信息等阻塞点（`src/lib/chat-simulation`） |
| **wuhan 组件** | `src/components/wuhan`：与 unnamed-ui 对齐的业务/区块组件（开发中，类型未完全收敛） |
| **AI 工程化** | `.cursor/rules`、`.cursor/skills`、`mcp.json`（Figma Desktop、wuhan-components） |

---

## 技术栈（简）

- React 19、TypeScript、Vite 7  
- Tailwind CSS 4、shadcn/ui、Radix  
- unnamed-ui / wuhan 组件体系（composed → blocks → ui）

详见 [`.cursor/rules/project-overview.mdc`](.cursor/rules/project-overview.mdc)（Cursor 内自动应用）。

---

## 快速开始

```bash
pnpm install
pnpm dev
```

```bash
# 生产构建（当前为绕过 wuhan 未完成类型，仅走 Vite 打包）
pnpm build

# 全量 TypeScript 检查（含 wuhan，未修完前可能报错）
pnpm typecheck
```

---

## 文档（`docs/`）

在 GitHub 上可直接点击链接跳转查阅。

| 文档 | 梗概 |
|------|------|
| [**简要总结**](docs/AI_CODING_EXECUTIVE_SUMMARY.md) | 从成果、效率、投入产出梳理本次 AI 搭建对话页的过程；基础设施（组件模板、UWS、Rules、Skills、MCP）与后续建议。 |
| [**回顾与反思**](docs/AI_CODING_RETROSPECTIVE.md) | 技术向：人类指导修正清单、减少返工的做法、对话 Mock 与协议化思路、实现目录结构、做得好与不好的点。 |
| [**本地 Figma MCP**](docs/figma-mcp-local.md) | 本地桌面 MCP 的价值、与在线 MCP 配额对比、配置步骤、**文件权限与 Dev Mode**、选区过大 **token 限制**及**按 node 拆分**的规避方式。 |

---

## AI 工具与 MCP（补充说明）

- **Cursor Rules**：约束技术栈、组件优先级、设计 token，减少生成代码跑偏。  
- **Skills**：例如 `generate-page`，规范「拆需求 → 蓝图 → 选型 → 实现」流程。  
- **wuhan-components MCP**：从组件库拉 API、最佳实践（需在本机配置 `mcp.json` 中的路径）。  
- **Figma Desktop MCP**：`http://127.0.0.1:3845/mcp`，需在 Figma 桌面端启用；细节见 [docs/figma-mcp-local.md](docs/figma-mcp-local.md)。

`.cursor/mcp.json` 中的绝对路径（如组件库 MCP 的 `node` 脚本）在克隆后需按你的本机目录修改。

---

## 已知限制（实验项目）

1. **`src/components/wuhan`** 仍在迭代，**`pnpm typecheck`** 可能因未使用变量等报错；**`pnpm build`** 已改为不跑 `tsc`，仅保证能出包。  
2. **对话流程** 为前端 **Mock**（`chat-simulation`），对接真实 SSE / WebSocket 时需替换数据源，保留渲染与协议层思路即可。  
3. **Figma / MCP** 依赖本机 Figma 桌面版与设计文件权限，见文档说明。

---

## 仓库结构（节选）

```
src/
├── components/wuhan/     # unnamed-ui 侧组件（blocks / composed）
├── lib/chat-simulation/  # 对话阶段、流式、阻塞模拟
├── pages/                # chat-panel、data-source、workspace 等
docs/                     # AI Coding 与 Figma MCP 文档
.cursor/                  # rules、skills、mcp 配置
```

---

## 可继续探索的方向（实验课题）

- 将 **Mock 阶段配置** 抽成 JSON/YAML，与 **真实接口事件** 共用同一套渲染协议。  
- 为「对话 Mock」单独写一条 **Cursor Rule / Skill**，固化阶段类型与常见坑（如 `generatingContent`）。  
- 在 **CI** 中只对 `src/pages`、`src/lib`（排除 wuhan）跑 `tsc`，或等 wuhan 类型收敛后恢复 `build` 前全量检查。  
- 用 **Figma 小选区 + node-id** 迭代子页面，对比「整页一次拉取」的 token 与还原质量。

---

## 许可与声明

默认继承模板与依赖库的许可；本仓库用于 **学习与实验**。若将 wuhan 或 MCP 路径用于其他环境，请自行检查 unnamed-ui 与 Figma 的使用条款。

---

## 延伸阅读（官方）

- [Vite](https://vite.dev/) · [React](https://react.dev/)  
- [Cursor — Model Context Protocol](https://docs.cursor.com/context/model-context-protocol)  
- [Figma — Desktop MCP Server](https://developers.figma.com/docs/figma-mcp-server/local-server-installation/)
