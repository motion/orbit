import { colorToString } from './helpers/helpers'
import { GlossConfiguration } from './types'

export const defaultMediaQueries = {
  sm: '@media screen and (max-width: 500px)',
  notsm: '@media screen and (min-width: 501px)',
  md: '@media screen and (min-width: 780px)',
  lg: '@media screen and (min-width: 900px)',
  xl: '@media screen and (min-width: 1100px)',
}

export const GlossDefaultConfig: GlossConfiguration = {
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
  mediaQueries: defaultMediaQueries,
}

export let Config = { ...GlossDefaultConfig }

export function configureGloss(options: Partial<GlossConfiguration>) {
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
