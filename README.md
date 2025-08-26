# DeepSeek Chat 应用

这是一个基于 React + TypeScript + Apollo Client 的聊天应用，集成了 GraphQL 查询和 Markdown 渲染功能。

## 功能特性

- 💬 基于 DeepSeek 的 AI 聊天功能
- 🔄 GraphQL 查询支持
- 📝 Markdown 内容渲染
- 🚀 React Router 多页面路由
- 🎨 响应式设计
- 📱 完整的移动端 H5 适配

## 移动端 H5 适配特性

- **响应式布局**: 自动适配不同屏幕尺寸（手机、平板、桌面）
- **触摸优化**: 触摸友好的按钮尺寸和交互反馈
- **移动端导航**: 优化的移动端导航菜单
- **横屏支持**: 横屏模式下的布局优化
- **高分辨率**: 支持 Retina 等高分辨率屏幕
- **iOS 兼容**: 防止 iOS 设备上的缩放问题

## 路由结构

- `/` - 首页，包含聊天功能
- `/about` - 关于页面，展示项目信息

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Apollo Client (GraphQL)
- **路由**: React Router DOM
- **样式**: UnoCSS + 响应式 CSS
- **构建工具**: Webpack 5 + Babel

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── App.tsx          # 主应用组件和路由配置
├── pages/
│   └── About.tsx    # 关于页面组件
├── index.tsx        # 应用入口
└── index.css        # 全局样式（包含移动端适配）
```

## 使用说明

1. 访问首页 `/` 开始聊天
2. 在输入框中输入问题
3. 系统会调用 DeepSeek GraphQL 接口获取回答
4. 回答内容支持 Markdown 格式渲染
5. 点击导航菜单可以在不同页面间切换
6. 在移动设备上自动适配触摸操作

## 移动端测试

- 在浏览器中按 F12 打开开发者工具
- 切换到移动设备模拟模式
- 测试不同屏幕尺寸的显示效果
- 验证触摸交互的响应性

## 注意事项

- 确保网络连接正常，应用需要访问 DeepSeek GraphQL 服务
- 聊天记录存储在本地状态中，刷新页面会丢失
- 支持 Markdown 语法，包括代码块、列表、链接等
- 移动端已优化触摸体验，支持各种移动设备
