export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

const systemFont = `-apple-system, "SF Pro Text", BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', sans-serif`

export const fontProps = {
  TitleFont: {
    fontFamily: 'GTEesti',
    // WebkitFontSmoothing: 'initial',
  },
  BodyFont: {
    fontFamily: `${systemFont}`,
    // WebkitFontSmoothing: 'antialiased',
  },
  SystemFont: {
    fontFamily: systemFont,
  },
}

export const widths = {
  xs: 420,
  sm: 700,
  md: 820,
  lg: 1150,
}

export const sectionMaxHeight = 1250
export const sidePad = 24

export const mediaQueries = {
  xs: `@media screen and (max-width: ${widths.xs - 1}px)`,
  sm: `@media screen and (max-width: ${widths.sm}px)`,
  notsm: `@media screen and (min-width: ${widths.sm + 1}px)`,
  md: `@media screen and (max-width: ${widths.md}px)`,
  notmd: `@media screen and (min-width: ${widths.md + 1}px)`,
  lg: `@media screen and (min-width: ${widths.lg}px)`,
}

export const IS_CHROME = navigator.userAgent.toLowerCase().indexOf('chrome') > -1

export const bodyElement = IS_CHROME ? document.documentElement : document.body

const hiddenWhen: { [key in keyof typeof mediaQueries]: Object } = Object.keys(mediaQueries).reduce(
  (acc, key) => {
    acc[key] = {
      [`${key}-display`]: 'none',
      [`${key}-pointerEvents`]: 'none',
    }
    return acc
  },
  {},
) as any

const visibleWhen: { [key in keyof typeof mediaQueries]: Object } = Object.keys(
  mediaQueries,
).reduce((acc, key) => {
  acc[key] = {
    display: 'none',
    [`${key}-display`]: 'flex',
  }
  return acc
}, {}) as any

export const mediaStyles = {
  hiddenWhen,
  visibleWhen,
}
