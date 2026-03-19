import { UserPlus } from "lucide-react";
import { PageHeaderButton } from "@/components/wuhan/blocks/page-header-01";
import {
  PageHeader,
  PageHeaderButtonGroup,
  PageHeaderUser,
} from "@/components/wuhan/composed/page-header";
import { TripleSplitPane } from "@/components/wuhan/composed/triple-split-pane";
import { ChatPanel } from "@/pages/chat-panel";
import { DataSourcePanel } from "@/pages/data-source-panel";
import { WorkspacePanel } from "@/pages/workspace-panel";

function App() {
  return (
    <div className="h-full p-3 flex flex-col gap-3 overflow-hidden bg-[var(--Container-bg-neutral-light)]">
      <PageHeader
        logo={
          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
        }
        title="智能助手"
        actions={
          <div className="flex items-center gap-[var(--Gap-gap-xl)]">
            <PageHeaderButtonGroup>
              <PageHeaderButton
                variant="outline"
                color="secondary"
                size="md"
                className="rounded-full h-8 px-[var(--Padding-padding-com-xl)] [&>span]:inline-flex [&>span]:items-center [&>span]:gap-[var(--Gap-gap-md)]"
              >
                <UserPlus className="size-4 shrink-0" />
                协作
              </PageHeaderButton>
            </PageHeaderButtonGroup>
            <PageHeaderUser
              name="User"
              avatarSrc="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
            />
          </div>
        }
      />
      <TripleSplitPane
        className="w-full flex-1 overflow-hidden"
        left={{
          title: "数据来源",
          width: "240px",
          collapsedWidth: "0px",
          minWidth: "240px",
          children: <DataSourcePanel />,
          classNames: {
            body: "p-0 overflow-hidden",
          },
        }}
        leftPopover={{
          enabled: true,
          width: "240px",
          height: "520px",
          className: "px-2! py-4!",
          content: <DataSourcePanel />,
        }}
        center={{
          title: "对话",
          minWidth: "280px",
          children: <ChatPanel />,
          classNames: {
            body: "p-0 overflow-hidden",
          },
        }}
        right={{
          title: "工作空间",
          width: "360px",
          collapsedWidth: "48px",
          minWidth: "360px",
          children: <WorkspacePanel />,
          classNames: {
            body: "p-0 overflow-hidden",
          },
        }}
      />
    </div>
  );
}
export default App;
