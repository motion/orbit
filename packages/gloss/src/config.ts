import { colorToString } from '.'
import { getIsPropTheme } from './helpers/getIsPropTheme'
import { GlossOptions } from './types'

export const Config: GlossOptions = {
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
  pseudoAbbreviations: {},
  preProcessTheme: getIsPropTheme,
  defaultThemeFn: null,
}

export function configureGloss(options: Partial<GlossOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}
