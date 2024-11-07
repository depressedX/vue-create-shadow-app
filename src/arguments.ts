import type { ComponentCustomElementInterface } from 'vue'

declare module 'vue' {
  interface ComponentInternalInstance {
    ce?: ComponentCustomElementInterface
    /**
     * is custom element? (kept only for compatibility)
     * @internal
     */
    isCE?: boolean
  }
}

export {}
