import { toColor } from '@o/color'

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const sectionMaxHeight = 1250
export const sidePad = 40
export const smallSize = 980
export const mediumSize = 1250
export const smallMax = smallSize - 1
export const smallMin = smallSize

export const PAGE_WIDTH = smallSize
export const SECTION_HEIGHT = 1100 //Math.max(980, Math.min(1300, window.innerHeight))

export const colorMain = toColor('#F5F7F9')
export const colorSecondary = toColor('rgb(94.5%, 80.1%, 12.3%)')
export const colorTeal = toColor('#49ceac')
export const colorBlue = toColor('#133cca')

const largeSize = smallSize - 1
export const screen = {
  smallQuery: `@media (max-width: ${smallSize}px)`,
  largeQuery: `@media (max-width: ${largeSize}px)`,
  small: { maxWidth: smallSize },
  large: { minWidth: largeSize },
  medium: { maxWidth: smallSize * 1.1 },
  tall: { minHeight: sectionMaxHeight },
}
