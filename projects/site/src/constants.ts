export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const sectionMaxHeight = 1250
export const sidePad = 40
export const smallSize = 980
export const mediumSize = 1250
export const smallMax = smallSize - 1
export const smallMin = smallSize

export const PAGE_WIDTH = smallSize
export const SECTION_HEIGHT = 1100 //Math.max(980, Math.min(1300, window.innerHeight))

const largeSize = smallSize - 1
export const screen = {
  smallQuery: `@media (max-width: ${smallSize}px)`,
  largeQuery: `@media (max-width: ${largeSize}px)`,
  small: { maxWidth: smallSize },
  large: { minWidth: largeSize },
  medium: { maxWidth: smallSize * 1.1 },
  tall: { minHeight: sectionMaxHeight },
}
