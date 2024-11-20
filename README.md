# vue-create-shadow-app

mount `vue(3.x)` App in shadowDom

## when to use

[Vue 3.5](https://blog.vuejs.org/posts/vue-3-5) has good support build vue in CustomElement mode, which is base on shadow dom.

While if you want the isolation ability of shadow dom and dont want to use custom element (eg. custom element is unavailable in chrome extension sandbox environment), try this library.

## How to use

### project setup

Before using this, make sure you've followed the official instruction there [Vue and Web Components](https://vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue)

except this part: 
```typescript

// Register the custom element.
// After registration, all `<my-vue-element>` tags
// on the page will be upgraded.
customElements.define('my-vue-element', MyVueElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

Instead of register you instance using `customElement.define`, you should use `createShadowApp` in this pkg to mount you app like `createApp` in `vue`.

### replace `createApp`

It acts just like `createApp` in `vue`

And the 3rd parameter allows you to ship global styles like [vue.defineCustomElement](https://vuejs.org/api/custom-elements.html#definecustomelement).

```ts
import { createShadowApp } from 'vue-create-shadow-app'

const app = createShadowApp(
  App,
  {
    someProp: 'someValue',
  },
  {
    styles: [elementStyle, ...App.styles],
  },
)
app.use(ElementPlus)
```
