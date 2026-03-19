import { TripleSplitPane } from "@/components/wuhan/composed/triple-split-pane";
import {
  PageHeader,
  PageHeaderUser,
} from "@/components/wuhan/composed/page-header";

function App() {
  return (
    <div className="h-full p-3 flex flex-col gap-3 overflow-hidden bg-[var(--bg-neutral-light)]">
      <PageHeader
        logo={
          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
        }
        title="智能助手"
        actions={
          <>
            <PageHeaderUser
              name="User"
              avatarSrc="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
            />
          </>
        }
      />
      <TripleSplitPane
        className="w-full flex-1 overflow-hidden"
        left={{
          title: "数据来源",
          width: "240px",
          collapsedWidth: "0px",
          minWidth: "240px",
          children: <div>数据来源</div>,
          classNames: {
            body: "px-2 py-4",
          },
        }}
        leftPopover={{
          enabled: true,
          width: "240px",
          height: "520px",
          className: "px-2! py-4!",
          content: <div>数据来源</div>,
        }}
        center={{
          title: "对话",
          minWidth: "280px",
          children: <div>对话</div>,
        }}
        right={{
          title: "工作空间",
          width: "360px",
          collapsedWidth: "48px",
          minWidth: "360px",
          children: <div>工作空间</div>,
          classNames: {
            body: "p-4",
          },
        }}
      />
    </div>
  );
}
export default App;
