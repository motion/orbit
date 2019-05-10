import { CSSOptions } from './types'

export const Config: CSSOptions = {
  isColor: _ => _ && !!_.toString,
  toColor: _ => _.toString(),
}

export function configureCSS(options: Partial<CSSOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}
