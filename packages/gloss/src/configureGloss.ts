import { colorToString } from './helpers/helpers'
import { GlossConfiguration } from './types'

// for now just copied from site, its a decent default set
// need to manually sync to site/constants
const widths = {
  xs: 420,
  sm: 700,
  md: 820,
  lg: 1150,
}
export const defaultMediaQueries = {
  xs: `@media screen and (max-width: ${widths.xs - 1}px)`,
  sm: `@media screen and (max-width: ${widths.sm}px)`,
  abovesm: `@media screen and (min-width: ${widths.sm + 1}px)`,
  md: `@media screen and (max-width: ${widths.md}px)`,
  belowmd: `@media screen and (max-width: ${widths.md}px)`,
  abovemd: `@media screen and (min-width: ${widths.md + 1}px)`,
  lg: `@media screen and (min-width: ${widths.lg}px)`,
  belowlg: `@media screen and (max-width: ${widths.lg}px)`,
  abovelg: `@media screen and (min-width: ${widths.lg + 1}px)`,
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
