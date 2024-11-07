import {
  createApp,
  getCurrentInstance,
  h,
  type CreateAppFunction,
  type ComponentPublicInstance,
  type ComponentInternalInstance,
} from 'vue'
import './arguments'

const ceChildStyleMap = /* @__PURE__ */ new Map()

export const createShadowApp: CreateAppFunction<Element> = (rootComponent, rootProps) => {
  let shadowRoot: ShadowRoot | null = null
  const rawApp = createApp(
    {
      render: () => h(rootComponent, { ref: 'root' }),
      setup() {
        // const app = createApp()

        const instance = getCurrentInstance()
        if (!instance) {
          throw new Error('no instance')
        }
        // Object.assign(instance.appContext, app._context)
        // Object.assign(instance.provides, app._context.provides)
        instance.isCE = true
        Object.defineProperty(instance, 'shadowRoot', {
          get() {
            return shadowRoot
          },
        })
        instance.addCEChildStyle = _addChildStyles.bind(instance)
        instance.removeCEChildStyle = _removeChildStyles.bind(instance)
      },
      methods: {
        getRootRef() {
          return this.$refs.root
        },
      },
    },
    rootProps,
  )
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

    shadowRoot = rootElm.attachShadow({ mode: 'open' })

    const appRoot = document.createElement('div')
    appRoot.id = 'app-root'
    shadowRoot.appendChild(appRoot)

    return rawApp.mount(appRoot, isHydrate, isSVG)
  }
  return converted
}

function _addChildStyles(
  this: ComponentInternalInstance,
  styles: string[] | undefined,
  instance: ComponentInternalInstance,
) {
  if (styles) {
    const styleContent = styles.join()
    let cecStyle = /* @__PURE__ */ new Set()
    if (ceChildStyleMap.has(styleContent)) {
      cecStyle = ceChildStyleMap.get(styleContent)
      cecStyle.add(instance.uid)
      ceChildStyleMap.set(styleContent, cecStyle)
      return
    }
    cecStyle.add(instance.uid)
    ceChildStyleMap.set(styleContent, cecStyle)
    const ceStyleId = `data-v-ce-${instance.uid}`
    styles.forEach((css) => {
      const s = document.createElement('style')
      s.textContent = css
      s.setAttribute(ceStyleId, '')
      if (this._childStylesAnchor) {
        instance.root.shadowRoot.insertBefore(s, this._childStylesAnchor.nextSibling)
      } else {
        instance.root.shadowRoot.appendChild(s)
      }
      this._childStylesAnchor = s
      {
        ;(this._styles || (this._styles = [])).push(s)
      }
    })
  }
}
function _removeChildStyles(
  this: ComponentInternalInstance,
  styles: string[] | undefined,
  uid: string,
) {
  if (styles) {
    const styleContent = styles.join()
    let cecStyle = /* @__PURE__ */ new Set()
    if (ceChildStyleMap.has(styleContent)) {
      cecStyle = ceChildStyleMap.get(styleContent)
      cecStyle.delete(uid)
      if (cecStyle.size === 0) {
        const sList = this.root.shadowRoot.querySelectorAll(`[data-v-ce-${uid}]`)
        sList.length > 0 && sList.forEach((s) => this.shadowRoot.removeChild(s))
        const archor = this.root.shadowRoot.querySelectorAll('style')
        this._childStylesAnchor = archor.length > 0 ? archor[archor.length - 1] : void 0
        ceChildStyleMap.delete(styleContent)
      } else {
        ceChildStyleMap.set(styleContent, cecStyle)
      }
    }
  }
}
