/* eslint-disable vue/prefer-import-from-vue */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type App,
  type Component,
  type ComponentPublicInstance,
  getCurrentInstance,
  createApp,
  h,
  defineComponent,
  type ComponentInternalInstance,
  ref,
  onMounted,
} from 'vue'
import { extend, hyphenate, isPlainObject } from '@vue/shared'
import type { ExtractPublicPropsFromSFCComponent } from './vue-utils'

export interface CustomElementOptions {
  styles?: string[]
  shadowRoot?: boolean
  nonce?: string
}

// content-script 无法使用 customElement 因此基于 HtmlElement 模拟
interface FakeElement extends HTMLElement {
  _styleChildren: WeakSet<any>
  _injectChildStyle(comp: any): void
  _removeChildStyle(comp: any): void
  _applyStyles(styles: string[] | undefined, owner?: any): void
  _nonce?: string
  _instance: ComponentInternalInstance | null
}

export function createShadowApp<HostElement, C extends Component>(
  rootComponent: C,
  rootProps: ExtractPublicPropsFromSFCComponent<C>,
  extraOptions?: CustomElementOptions,
): App<HostElement> {
  const Comp = defineComponent(rootComponent as any, extraOptions as any) as any
  if (isPlainObject(Comp)) extend(Comp, extraOptions)

  let shadowRoot: ShadowRoot | null = null

  // 模拟 custom element
  let fakeCE: FakeElement | null = null

  const rawApp = createApp({
    setup() {
      // const app = createApp()
      const rootInstance = ref(null)

      const instance = getCurrentInstance()
      if (!instance) {
        throw new Error('no instance')
      }

      fakeCE!._instance = instance
      instance.ce = fakeCE as any
      instance.isCE = true // for vue-i18n backwards compat

      const dispatch = (event: string, args: any[]) => {
        fakeCE!.dispatchEvent(
          new CustomEvent(
            event,
            isPlainObject(args[0]) ? extend({ detail: args }, args[0]) : { detail: args },
          ),
        )
      }

      instance.emit = (event: string, ...args: any[]) => {
        dispatch(event, args)
        if (hyphenate(event) !== event) {
          dispatch(hyphenate(event), args)
        }
      }
      onMounted(() => {
        instance.exposed = {}
        instance.exposeProxy = rootInstance.value
      })
      return () => {
        const vnode = h(rootComponent, { ...rootProps, ref: rootInstance })
        ;(vnode as any).ce = (instance: any) => {
          instance.ce = instance.root.ce
        }
        return vnode
      }
    },
  })
  const converted = Object.create(rawApp)
  converted.mount = (
    rootContainer: Element | string,
    isHydrate?: boolean,
    isSVG?: boolean,
  ): ComponentPublicInstance => {
    const rootElm =
      typeof rootContainer === 'string' ? document.querySelector(rootContainer) : rootContainer
    if (!rootElm) {
      throw new Error(`dom ${rootContainer} is not found`)
    }

    fakeCE = rootElm as FakeElement
    fakeCE._nonce = extraOptions?.nonce
    fakeCE._instance = null
    fakeCE._injectChildStyle = function (comp: any): void {
      this._applyStyles(comp.styles, comp)
    }
    fakeCE._removeChildStyle = (): void => {}
    fakeCE._styleChildren = new WeakSet()
    fakeCE._applyStyles = function (styles: string[] | undefined, owner) {
      if (!styles) return
      if (owner) {
        if (owner === rootComponent || this._styleChildren.has(owner)) {
          return
        }
        this._styleChildren.add(owner)
      }
      const nonce = this._nonce
      for (let i = styles.length - 1; i >= 0; i--) {
        const s = document.createElement('style')
        if (nonce) s.setAttribute('nonce', nonce)
        s.textContent = styles[i]
        this.shadowRoot!.prepend(s)
        // record for HMR
      }
    }

    shadowRoot = rootElm.attachShadow({ mode: 'open' })

    const { styles } = Comp

    fakeCE._applyStyles(styles)

    const appRoot = document.createElement('div')
    shadowRoot.appendChild(appRoot)

    return rawApp.mount(appRoot, isHydrate, isSVG)
  }

  converted.use = (plugin: any, ...args: any[]) => {
    rawApp.use(plugin, ...args)
    return converted
  }
  return converted
}
