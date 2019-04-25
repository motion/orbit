export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const colors = {
  orange: '#F3C95F',
  red: '#FE5A59',
  purple: '#8C60F8',
}

export const widths = {
  small: 740,
  medium: 820,
  large: 1120,
}

export const sectionMaxHeight = 1250
export const sidePad = 24

export const screen = {
  smallQuery: `@media (max-width: ${widths.small}px)`,
}

export const IS_CHROME = navigator.userAgent.toLowerCase().indexOf('chrome') > -1

export const bodyElement = IS_CHROME ? document.documentElement : document.body
