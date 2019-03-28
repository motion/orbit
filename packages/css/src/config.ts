import { isColor, toColor } from '@o/color'
import { CSSOptions } from './types'

export const Config: CSSOptions = {
  isColor: isColor,
  toColor,
}

export function configureCSS(options: Partial<CSSOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}
