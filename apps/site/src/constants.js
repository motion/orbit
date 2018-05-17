import * as UI from '@mcro/ui'

export const sectionMaxHeight = 1250

export const smallSize = 980
export const mediumSize = 1250

export const smallMax = smallSize - 1
export const smallMin = smallSize

export const PAGE_WIDTH = smallSize

export const SLANT_AMT = 40
export const SECTION_HEIGHT = 1100 //Math.max(980, Math.min(1300, window.innerHeight))

export const SLANT = Math.atan(SLANT_AMT / (SECTION_HEIGHT / 2)) * 180 / Math.PI

export const ORA_LEFT_PAD = 285
export const ORA_TOP_PAD = 60
export const ORA_TOP = SECTION_HEIGHT
export const ORA_HEIGHT = 410
export const ORA_WIDTH = 300
export const ORA_BORDER_RADIUS = 6
export const ORA_PULL_UP = 110

export const colorMain = UI.color('rgb(28.8%, 24.8%, 73%)')
export const colorSecondary = UI.color('rgb(93.3%, 92.6%, 26.4%)')
export const colorTeal = UI.color('#49ceac')
export const colorBlue = UI.color('#133cca')

export const backgroundColor = UI.color('#fcfcfc')

export const mainLight = UI.color(colorMain)
  .lighten(0.65)
  .hex()

export const screen = {
  smallQuery: `@media (max-width: ${smallSize}px)`,
  small: { maxWidth: smallSize },
  large: { minWidth: smallSize - 1 },
  tall: { minHeight: sectionMaxHeight * 1.6 },
}
