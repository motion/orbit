import { toColor } from '@o/ui'

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const fontProps = {
  GTEesti: {
    fontFamily: 'GT Eesti',
    className: 'font-smooth',
  },
}

export const colors = {
  orange: toColor('#F3C95F'),
  red: toColor('#FE5A59'),
  purple: toColor('#8C60F8'),
}

export const widths = {
  tiny: 420,
  small: 740,
  medium: 940,
  large: 1180,
}

export const sectionMaxHeight = 1250
export const sidePad = 24

export const screen = {
  smallQuery: `@media (max-width: ${widths.small}px)`,
}

export const IS_CHROME = navigator.userAgent.toLowerCase().indexOf('chrome') > -1

export const bodyElement = IS_CHROME ? document.documentElement : document.body
