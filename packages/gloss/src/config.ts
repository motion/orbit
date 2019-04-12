import { colorToString } from '.'
import { preProcessTheme } from './helpers/preProcessTheme'
import { GlossOptions } from './types'

export const Config: GlossOptions = {
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
  pseudoAbbreviations: {
    hoverStyle: '&:hover',
    activeStyle: '&:active',
    focusStyle: '&:focus',
  },
  preProcessTheme: preProcessTheme,
}

export function configureGloss(options: Partial<GlossOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}
