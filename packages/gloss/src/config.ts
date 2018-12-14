import { GlossOptions } from './types'
import { colorToString } from './gloss'

export const Config: GlossOptions = {
  glossProp: 'css',
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
}

export function configureGloss(options: Partial<GlossOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}
