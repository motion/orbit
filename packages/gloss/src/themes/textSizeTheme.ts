type TextStyles = {
  fontSize?: string | number
  lineHeight?: string | number
  lineHeightNum?: number
  fontSizeNum?: number
  marginTop?: number
  marginBottom?: number
}

export type TextSizeProps = {
  sizeFont?: boolean | number
  sizeLineHeight?: boolean | number
  lineHeight?: number | string | any
  fontSize?: number | string | any
  size?: number
  sizeMethod?: string
}

// dont return undefined

export type TextSizeConfig = {
  scale?: number
  size?: number
}

export function getTextSizeTheme(props: TextSizeProps, extraProps?: TextSizeConfig) {
  const scale = (extraProps && extraProps.scale) || 1
  const size = ((extraProps && extraProps.size) || props.size || 1) * scale
  const sizeFont = props.sizeFont === true ? 1 : props.sizeFont || 1
  const sizeLineHeight = (props.sizeLineHeight === true ? 1 : props.sizeLineHeight || 1) * scale
  const specifiedFontSize = typeof props.fontSize !== 'undefined'
  let fontSize = props.fontSize
  // round fontsize/lineHeight the same direction
  let shouldRoundUp = false
  if (!specifiedFontSize) {
    fontSize = size * 14
    fontSize = sizeFont * fontSize
    shouldRoundUp = fontSize % 1 >= 0.5
    fontSize = Math.round(fontSize)
  }
  let styles: TextStyles | null = null
  let lineHeight = props.lineHeight
  if (typeof lineHeight === 'undefined' && typeof fontSize === 'number') {
    lineHeight = Math.log(fontSize * 500) * 2.25 + fontSize / 1.4 - 9.5
    lineHeight = lineHeight * sizeLineHeight
    lineHeight = shouldRoundUp ? Math.ceil(lineHeight) : Math.floor(lineHeight)
  }
  let fontSizeNum
  let lineHeightNum
  // find defaults and round them
  if (typeof fontSize === 'number') {
    fontSizeNum = fontSize
    styles = styles || {}
    styles.fontSizeNum = fontSizeNum
  }
  if (typeof lineHeight === 'number') {
    lineHeightNum = lineHeight
    styles = styles || {}
    styles.lineHeightNum = lineHeightNum
  }
  if (!specifiedFontSize) {
    if (typeof lineHeightNum === 'number') {
      const units = props.sizeMethod
      if (typeof units === 'undefined') {
        lineHeight = `${lineHeightNum}px`
        fontSize = `${fontSizeNum}px`
      } else if (units === 'vw') {
        lineHeight = `${lineHeightNum / 12}vw`
        fontSize = `${fontSizeNum / 12}vw`
      } else {
        lineHeight = `${lineHeightNum}${units}`
        fontSize = `${fontSizeNum}${units}`
      }
    }
  }
  if (fontSize) {
    styles = styles || {}
    styles.fontSize = fontSize
  }
  if (lineHeight) {
    styles = styles || {}
    styles.lineHeight = lineHeight
    // we only want lineHeight to affect the "in between lines"
    // in CSS by default it also adds padding above/below single-line text
    // so we remove that spacing by default here
    // TODO (gloss scales default line height to 14, we can make that adjustable)
    // CONST of lineHeight seems to be the proper amount to avoid the extra spacing
    styles.marginTop = -sizeLineHeight * 14 * LINE_HEIGHT_EXTRA_SCALE
    styles.marginBottom = -sizeLineHeight * 14 * LINE_HEIGHT_EXTRA_SCALE
  } else {
    console.log(
      'inherited, can we either do negative margin using relative units, or contextually pass down inherited font size',
    )
  }
  return styles
}

const LINE_HEIGHT_EXTRA_SCALE = 0.15
