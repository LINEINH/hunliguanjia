declare module 'uview-plus' {
  import type { App, Plugin } from 'vue'
  const uviewPlus: Plugin
  export default uviewPlus
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
