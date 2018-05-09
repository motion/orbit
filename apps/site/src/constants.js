import * as UI from '@mcro/ui'

export const smallSize = 1100

export const PAGE_WIDTH = smallSize

export const SLANT_AMT = 40
export const SECTION_HEIGHT = Math.max(1000, Math.min(1300, window.innerHeight))

export const SLANT = Math.atan(SLANT_AMT / (SECTION_HEIGHT / 2)) * 180 / Math.PI

export const ORA_LEFT_PAD = 285
export const ORA_TOP_PAD = 60
export const ORA_TOP = SECTION_HEIGHT
export const ORA_HEIGHT = 410
export const ORA_WIDTH = 300
export const ORA_BORDER_RADIUS = 6
export const ORA_PULL_UP = 110

export const colorMain = UI.color('rgb(92.1%, 69.7%, 34%)')
export const colorMainLight = colorMain.lighten(0.15)
export const colorMainDark = colorMain.darken(0.48)
export const colorSecondary = UI.color('rgb(98%, 90%, 36%)')
export const colorSecondaryLight = colorSecondary.lighten(0.35)
export const colorSecondaryDark = colorSecondary.darken(0.35)
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
