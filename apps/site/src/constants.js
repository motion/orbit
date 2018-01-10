import * as UI from '@mcro/ui'

export const smallSize = 1000

export const PAGE_WIDTH = smallSize

export const SLANT_AMT = 80
export const SECTION_HEIGHT = Math.max(
  900,
  Math.min(1100, window.innerHeight * 1.1),
)
export const SLANT = Math.atan(SLANT_AMT / (SECTION_HEIGHT / 2)) * 180 / Math.PI

export const ORA_LEFT_PAD = 285
export const ORA_TOP_PAD = 60
export const ORA_TOP = SECTION_HEIGHT
export const ORA_HEIGHT = 410
export const ORA_WIDTH = 300
export const ORA_BORDER_RADIUS = 6
export const ORA_PULL_UP = 110

export const colorMain = UI.color('rgb(84.3%, 31%, 55.7%)')
export const colorMainLight = colorMain.lighten(0.35)
export const colorSecondary = UI.color('rgb(84.3%, 31%, 44.5%)')
export const colorSecondaryLight = colorSecondary.lighten(0.35)
export const colorTeal = UI.color('#49ceac')
export const colorBlue = UI.color('#133cca')

export const mainLight = UI.color(colorMain)
  .lighten(0.65)
  .hex()

export const screen = {
  small: `@media (max-width: ${smallSize}px)`,
}

export const gradients = {
  main: {
    background: `linear-gradient(${colorMain}, ${colorMainLight})`,
    backgroundInverse: `linear-gradient(${colorMainLight}, ${colorMain})`,
  },
  secondary: {
    background: `linear-gradient(${colorSecondary}, ${colorSecondaryLight})`,
    backgroundInverse: `linear-gradient(${colorSecondaryLight}, ${colorSecondary})`,
  },
}
