import * as UI from '@mcro/ui'

export const smallSize = 900

export const PAGE_WIDTH = smallSize

export const SLANT_AMT = 60
export const SECTION_HEIGHT = Math.min(1200, window.innerHeight * 1.1)
export const SLANT = Math.atan(SLANT_AMT / (SECTION_HEIGHT / 2)) * 180 / Math.PI

export const ORA_LEFT_PAD = 285
export const ORA_TOP_PAD = 60
export const ORA_TOP = Math.max(930, window.innerHeight - 120)
export const ORA_HEIGHT = 410
export const ORA_WIDTH = 300
export const ORA_BORDER_RADIUS = 6

export const colorMain = '#000'
export const colorSecondary = '#222'
export const colorTeal = '#49ceac'
export const colorBlue = '#133cca'

export const mainLight = UI.color(colorMain)
  .lighten(0.65)
  .hex()

export const screen = {
  small: `@media (max-width: ${smallSize}px)`,
}

export const dark1 = UI.color(colorMain)
  .darken(0.7)
  .toString()
export const dark2 = UI.color(colorSecondary)
  .darken(0.45)
  .toString()

export const darkBackground = `linear-gradient(${colorMain}, ${colorSecondary})`
export const darkBackgroundInverse = `linear-gradient(${colorSecondary}, ${
  colorMain
})`
export const dark = {
  background: darkBackground,
}
