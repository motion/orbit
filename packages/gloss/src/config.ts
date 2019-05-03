import { colorToString } from '.'
import { preProcessTheme } from './helpers/preProcessTheme'
import { GlossOptions } from './types'

// type Required<T> = T extends object ? { [P in keyof T]-?: NonNullable<T[P]> } : T

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
