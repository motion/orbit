import * as UI from '@mcro/ui'

export const sectionMaxHeight = 1250
export const sidePad = 40
export const smallSize = 980
export const mediumSize = 1250
export const smallMax = smallSize - 1
export const smallMin = smallSize

export const PAGE_WIDTH = smallSize
export const SECTION_HEIGHT = 1100 //Math.max(980, Math.min(1300, window.innerHeight))

export const colorMain = UI.color('#F5F7F9')
export const colorSecondary = UI.color('rgb(94.5%, 80.1%, 12.3%)')
export const colorTeal = UI.color('#49ceac')
export const colorBlue = UI.color('#133cca')

export const leftBg = UI.color('#fff')
export const rightBg = UI.color('#fff')

export const featuresSlantColor = UI.color('#F2B0BF')
export const useCasesSlantBg1 = '#F4E1B5'
export const useCasesSlantBg2 = '#E0CACA'

export const backgroundColor = UI.color('#fff')

export const mainLight = UI.color(colorMain)
  .lighten(0.65)
  .hex()

export const screen = {
  smallQuery: `@media (max-width: ${smallSize}px)`,
  small: { maxWidth: smallSize },
  large: { minWidth: smallSize - 1 },
  medium: { maxWidth: smallSize * 1.1 },
  tall: { minHeight: sectionMaxHeight * 1.6 },
}

const blueBg = UI.color('#F5FAF9')
export const blueTheme = {
  background: blueBg,
  color: '#222',
  titleColor: blueBg.darken(0.75).desaturate(0.3),
  subTitleColor: blueBg.darken(0.7).desaturate(0.8),
}
