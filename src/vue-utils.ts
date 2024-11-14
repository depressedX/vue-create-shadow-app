import type { ComponentOptionsBase, ExtractPropTypes, ExtractPublicPropTypes } from 'vue'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
export type ExtractPublicPropsFromSFCComponent<T> =
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  T extends ComponentOptionsBase<Readonly<ExtractPropTypes<infer P>>, {}, {}, {}, {}, {}, {}, {}>
    ? Prettify<ExtractPublicPropTypes<P>>
    : never
