# vue-create-shadow-app

mount `vue(3.x)` App in shadowDom

## when to use

[Vue 3.5](https://blog.vuejs.org/posts/vue-3-5) has good support build vue in CustomElement mode, which is base on shadow dom.

While if you want the isolation ability of shadow dom and dont want to use custom element (eg. custom element is unavailable in chrome extension sandbox environment), try this library.

## How to use

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
