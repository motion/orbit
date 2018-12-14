import { CSSOptions } from './types'
import { isColor, toColor } from './toColor'

export const Config: CSSOptions = {
  isColor,
  toColor,
}

export function configureCSS(options: Partial<CSSOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}
