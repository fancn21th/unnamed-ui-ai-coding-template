#!/usr/bin/env node

/**
 * 批量安装 Wuhan UI 组件
 * 
 * 使用方法：
 *   node install-components.js [BASE_URL]
 *   
 * 示例：
 *   node install-components.js https://your-domain.vercel.app
 *   node install-components.js http://localhost:3000
 */

const { execSync } = require('child_process');

// 所有组件列表
const components = {
  base: [
    'avatar', 'progress', 'status-tag', 'tag', 'tooltip', 'custom-sources'
  ],
  buttons: [
    'block-button', 'icon-button', 'prompt', 'quick-action', 'suggestion', 'toggle-button'
  ],
  bubbles: [
    'avatar-header', 'confirm-panel', 'dynamic-form', 'feedback', 'message',
    'message-list', 'quote-content', 'task-list', 'welcome'
  ],
  cards: [
    'agent-card', 'document-card', 'file-card', 'goal-card', 'report-card',
    'select-card', 'task-card'
  ],
  inputs: [
    'block-input', 'block-select', 'checkbox', 'radio', 'sender',
    'responsive-sender', 'upload'
  ],
  layout: [
    'divider', 'page-header', 'sidebar', 'sources-sidebar', 'triple-split-pane'
  ],
  lists: [
    'attachment-list', 'component-panel', 'history-item'
  ],
  steps: [
    'block-accordion', 'deep-thinking', 'execution-result', 'thinking-process',
    'thinking-process-01', 'thinking-step-item'
  ]
};

// 获取基础 URL
const baseUrl = process.argv[2] || 'http://localhost:3000';

console.log('🚀 开始批量安装 Wuhan UI 组件...');
console.log(`📦 使用域名: ${baseUrl}`);
console.log('================================\n');

let totalInstalled = 0;
let totalFailed = 0;

// 遍历所有分类安装组件
for (const [category, componentList] of Object.entries(components)) {
  console.log(`\n📂 安装 ${category} 组件...`);
  
  for (const component of componentList) {
    const url = `${baseUrl}/r/wuhan/${component}.json`;
    
    try {
      console.log(`  ⏳ 安装 ${component}...`);
      execSync(`npx shadcn@latest add -y -o "${url}"`, {
        stdio: 'inherit'
      });
      console.log(`  ✅ ${component} 安装成功`);
      totalInstalled++;
    } catch (error) {
      console.error(`  ❌ ${component} 安装失败`);
      totalFailed++;
    }
  }
}

console.log('\n================================');
console.log(`✨ 安装完成！`);
console.log(`   成功: ${totalInstalled} 个组件`);
if (totalFailed > 0) {
  console.log(`   失败: ${totalFailed} 个组件`);
}
