import * as UI from '@mcro/ui'

export const smallSize = 1100
export const smallMax = smallSize - 1
export const smallMin = smallSize

export const PAGE_WIDTH = smallSize

export const SLANT_AMT = 40
export const SECTION_HEIGHT = 980 //Math.max(980, Math.min(1300, window.innerHeight))

export const SLANT = Math.atan(SLANT_AMT / (SECTION_HEIGHT / 2)) * 180 / Math.PI

export const ORA_LEFT_PAD = 285
export const ORA_TOP_PAD = 60
export const ORA_TOP = SECTION_HEIGHT
export const ORA_HEIGHT = 410
export const ORA_WIDTH = 300
export const ORA_BORDER_RADIUS = 6
export const ORA_PULL_UP = 110

export const backgroundColor = UI.color('#fcfcfc')
export const colorMain = UI.color('rgb(25.9%, 20.1%, 89.8%)')
export const colorSecondary = UI.color('rgb(93.3%, 92.6%, 26.4%)')
export const colorTeal = UI.color('#49ceac')
export const colorBlue = UI.color('#133cca')

export const BACKGROUND_ALT = UI.color('#fff')

export const mainLight = UI.color(colorMain)
  .lighten(0.65)
  .hex()

export const screen = {
  smallQuery: `@media (max-width: ${smallSize}px)`,
  small: { maxWidth: smallSize },
  large: { minWidth: smallSize - 1 },
  superLarge: { minWidth: smallSize * 1.5 },
}
