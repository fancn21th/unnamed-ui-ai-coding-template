"use client";

import * as React from "react";
import { Plus, FileText, FileSpreadsheet, Presentation } from "lucide-react";
import { Button } from "@/components/wuhan/composed/block-button";
import { Checkbox } from "@/components/wuhan/composed/checkbox";
import {
  FileCard,
  type FileItem,
} from "@/components/wuhan/composed/file-card";
import { cn } from "@/lib/utils";

// 文件类型图标映射
const FILE_ICONS = {
  pdf: <FileText className="size-5 text-[var(--Text-text-error)]" />,
  doc: <FileText className="size-5 text-[var(--Text-text-brand)]" />,
  xls: <FileSpreadsheet className="size-5 text-[var(--Text-text-success)]" />,
  ppt: <Presentation className="size-5 text-[var(--Text-text-warning)]" />,
} as const;

interface DataSourceSection {
  title: string;
  files: FileItem[];
}

const MOCK_SECTIONS: DataSourceSection[] = [
  {
    title: "临时上传",
    files: [
      {
        id: "tmp-1",
        title: "01-01.PRT_Ver1CH_Chinese...",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.pdf,
      },
      {
        id: "tmp-2",
        title: "01-02.SAP - SAMPLE",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.doc,
      },
      {
        id: "tmp-3",
        title: "01--3.Chinese_CSR_v2.0_09...",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.xls,
      },
      {
        id: "tmp-4",
        title: "f_14_02_01_01",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.ppt,
      },
    ],
  },
  {
    title: "企业知识库",
    files: [
      {
        id: "kb-1",
        title: "S1",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.pdf,
      },
      {
        id: "kb-2",
        title: "S2",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.doc,
      },
    ],
  },
  {
    title: "联网搜索",
    files: [
      {
        id: "web-1",
        title: "S3",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.xls,
      },
      {
        id: "web-2",
        title: "S4",
        date: "2026-02-05",
        fileIcon: FILE_ICONS.ppt,
      },
    ],
  },
];

export function DataSourcePanel() {
  const allFileIds = React.useMemo(
    () => MOCK_SECTIONS.flatMap((s) => s.files.map((f) => f.id)),
    [],
  );
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const allSelected =
    allFileIds.length > 0 && selectedIds.size === allFileIds.length;

  const handleSelectAll = React.useCallback(
    (e: { target: { checked: boolean } }) => {
      if (e.target.checked) {
        setSelectedIds(new Set(allFileIds));
      } else {
        setSelectedIds(new Set());
      }
    },
    [allFileIds],
  );

  const handleSectionChange = React.useCallback(
    (sectionFiles: FileItem[]) => {
      return (newIds: Set<string>) => {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          const sectionIds = new Set(sectionFiles.map((f) => f.id));
          sectionIds.forEach((id) => next.delete(id));
          newIds.forEach((id) => next.add(id));
          return next;
        });
      };
    },
    [],
  );

  return (
    <div
      data-slot="data-source-panel"
      className={cn(
        "flex flex-col gap-[var(--Gap-gap-lg)]",
        "bg-[var(--Container-bg-container)]",
        "px-[var(--Padding-padding-com-md)] py-[var(--Padding-padding-com-xl)]",
        "h-full overflow-hidden",
      )}
    >
      {/* 添加来源按钮 */}
      <Button
        variant="outline"
        color="secondary"
        size="md"
        block
        icon={<Plus className="size-4" />}
        className="h-8"
      >
        添加来源
      </Button>

      {/* 全选 */}
      <div className="flex items-center gap-[var(--Gap-gap-md)] px-[var(--Padding-padding-com-md)]">
        <Checkbox
          checked={allSelected}
          indeterminate={selectedIds.size > 0 && !allSelected}
          onChange={handleSelectAll}
        >
          全选
        </Checkbox>
      </div>

      {/* 分区列表 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-[var(--Gap-gap-lg)]">
        {MOCK_SECTIONS.map((section) => (
          <DataSourceSectionBlock
            key={section.title}
            title={section.title}
            files={section.files}
            selectedIds={selectedIds}
            onChange={handleSectionChange(section.files)}
          />
        ))}
      </div>
    </div>
  );
}

interface DataSourceSectionBlockProps {
  title: string;
  files: FileItem[];
  selectedIds: Set<string>;
  onChange: (ids: Set<string>) => void;
}

function DataSourceSectionBlock({
  title,
  files,
  selectedIds,
  onChange,
}: DataSourceSectionBlockProps) {
  const handleSelectChange = React.useCallback(
    (id: string, checked: boolean) => {
      const sectionIds = new Set(files.map((f) => f.id));
      const currentSectionSelected = new Set(
        [...sectionIds].filter((i) => selectedIds.has(i)),
      );
      const next = new Set(currentSectionSelected);
      if (checked) next.add(id);
      else next.delete(id);
      onChange(next);
    },
    [files, selectedIds, onChange],
  );

  return (
    <div className="flex flex-col gap-[var(--Gap-gap-xs)]">
      <div className="pl-[var(--Padding-padding-com-md)]">
        <p
          className={cn(
            "font-[var(--font-family-CN)] font-size-2 leading-[var(--line-height-2)]",
            "text-[var(--Text-text-tertiary)]",
          )}
        >
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-[var(--Gap-gap-xs)]">
        {files.map((file) => (
          <FileCard
            key={file.id}
            id={file.id}
            title={file.title}
            date={file.date}
            fileIcon={file.fileIcon}
            selected={selectedIds.has(file.id)}
            onSelectChange={(checked, id) => handleSelectChange(id, checked)}
            actionMenuItems={[]}
            className="[&>*:last-child]:hidden"
          />
        ))}
      </div>
    </div>
  );
}
