import { colorToString } from '.'
import { GlossOptions } from './types'

export const Config: GlossOptions = {
  glossProp: 'css',
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
}

export function configureGloss(options: Partial<GlossOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}
