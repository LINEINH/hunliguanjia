import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";@import "uview-plus/theme.scss";`,
        // 屏蔽 Sass 弃用警告
        silenceDeprecations: ['legacy-js-api', 'import'],
        // 或者使用 api: 'modern-compiler' (需要 Dart Sass 1.70+)
        // api: 'modern-compiler'
      }
    }
  }
});
