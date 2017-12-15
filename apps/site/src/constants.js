import * as UI from '@mcro/ui'

export const smallSize = 900

export const PAGE_WIDTH = smallSize

export const SLANT_AMT = 60
export const SECTION_HEIGHT = Math.max(
  900,
  Math.min(1100, window.innerHeight * 1.1)
)
export const SLANT = Math.atan(SLANT_AMT / (SECTION_HEIGHT / 2)) * 180 / Math.PI

export const ORA_LEFT_PAD = 285
export const ORA_TOP_PAD = 60
export const ORA_TOP = SECTION_HEIGHT
export const ORA_HEIGHT = 410
export const ORA_WIDTH = 300
export const ORA_BORDER_RADIUS = 6

export const colorMain = 'rgb(0%, 50.3%, 99.9%)'
export const colorSecondary = 'rgb(92.1%, 0%, 38.4%)'
export const colorTeal = '#49ceac'
export const colorBlue = '#133cca'

export const mainLight = UI.color(colorMain)
  .lighten(0.65)
  .hex()

export const screen = {
  small: `@media (max-width: ${smallSize}px)`,
}

export const dark1 = UI.color(colorMain)
  // .darken(0.75)
  .toString()
export const dark2 = UI.color(colorSecondary)
  // .darken(0.75)
  .toString()

export const darkBackground = dark1
export const darkBackgroundInverse = dark2

export const dark = {
  background: darkBackground,
}

export const darkInverse = {
  background: darkBackgroundInverse,
}
