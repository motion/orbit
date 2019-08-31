export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const fontProps = {
  TitleFont: {
    fontFamily: 'GTEesti',
    WebkitFontSmoothing: 'initial',
  },
  BodyFont: {
    fontFamily: 'Colfax',
    WebkitFontSmoothing: 'antialiased',
  },
}

export const widths = {
  tiny: 420,
  small: 700,
  medium: 860,
  large: 1100,
}

export const sectionMaxHeight = 1250
export const sidePad = 24

export const screen = {
  smallQuery: `@media (max-width: ${widths.small}px)`,
}

export const IS_CHROME = navigator.userAgent.toLowerCase().indexOf('chrome') > -1

export const bodyElement = IS_CHROME ? document.documentElement : document.body
