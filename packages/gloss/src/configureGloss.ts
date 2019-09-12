import { colorToString } from './helpers/helpers'
import { preProcessTheme } from './helpers/preProcessTheme'
import { GlossConfig } from './types'

export const GlossDefaultConfig: GlossConfig = {
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
  mediaQueries: {
    sm: '@media screen and (max-width: 500px)',
    notsm: '@media screen and (min-width: 501px)',
    lg: '@media screen and (min-width: 900px)',
  },
  pseudoAbbreviations: {
    hoverStyle: '&:hover',
    activeStyle: '&:active',
    focusStyle: '&:focus',
    disabledStyle: '&:disabled',
  },
  preProcessTheme: preProcessTheme,
}

export let Config = { ...GlossDefaultConfig }

export function configureGloss(options: Partial<GlossConfig>) {
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
