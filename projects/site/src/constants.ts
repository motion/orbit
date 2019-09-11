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
  SystemFont: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  },
}

export const widths = {
  xs: 420,
  sm: 700,
  md: 860,
  lg: 1150,
}

export const sectionMaxHeight = 1250
export const sidePad = 24

export const mediaQueries = {
  xs: `@media screen and (max-width: ${widths.xs - 1}px)`,
  sm: `@media screen and (min-width: ${widths.xs}px) and (max-width: ${widths.md - 1})`,
  md: `@media screen and (min-width: ${widths.md}px) and (max-width: ${widths.lg - 1})`,
  lg: `@media screen and (min-width: ${widths.lg}px)`,
}

export const IS_CHROME = navigator.userAgent.toLowerCase().indexOf('chrome') > -1

export const bodyElement = IS_CHROME ? document.documentElement : document.body
