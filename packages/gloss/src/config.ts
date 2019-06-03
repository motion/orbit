import { colorToString } from '.'
import { preProcessTheme } from './helpers/preProcessTheme'
import { GlossOptions } from './types'

// type Required<T> = T extends object ? { [P in keyof T]-?: NonNullable<T[P]> } : T

export let Config: GlossOptions = {
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
  pseudoAbbreviations: {
    hoverStyle: '&:hover',
    activeStyle: '&:active',
    focusStyle: '&:focus',
    disabledStyle: '&:disabled',
  },
  preProcessTheme: preProcessTheme,
}

export function configureGloss(options: Partial<GlossOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}

if (typeof module !== 'undefined' && module.hot) {
  module.hot.accept(() => {
    if (module.hot) {
      Config = module.hot.data || Config
    }
  })
  module.hot.dispose(_ => {
    _.data = Config
  })
}
