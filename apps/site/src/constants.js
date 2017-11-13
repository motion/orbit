import * as UI from '@mcro/ui'

export const smallSize = 900

export const ORA_HEIGHT = 450
export const ORA_WIDTH = 300
export const ORA_BORDER_RADIUS = 6

export const colorMain = '#4f78de'
export const colorSecondary = '#7d43bc'
export const colorTeal = '#49ceac'
export const colorBlue = '#133cca'

export const mainLight = UI.color(colorMain)
  .lighten(0.65)
  .hex()

export const screen = {
  small: `@media (max-width: ${smallSize}px)`,
}
