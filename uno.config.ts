/**
 * UnoCSS 配置，用于聊天应用
 * 使用 Uno 预设提供类似 Tailwind 的实用类
 */
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(), // 默认 UnoCSS 预设，类似 Tailwind CSS
  ],
  content: {
    pipeline: {
      include: ['./src/**/*.{ts,tsx}'], // 扫描 TypeScript 和 TSX 文件中的 UnoCSS 类
    },
  },
});