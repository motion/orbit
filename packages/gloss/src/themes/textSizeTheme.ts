type TextStyles = {
  fontSize?: string | number
  lineHeight?: string | number
  lineHeightNum?: number
  fontSizeNum?: number
}

export type TextSizeProps = {
  sizeLineHeight?: boolean | number
  lineHeight?: number | string | any
  fontSize?: number | string | any
  size?: number
  sizeMethod?: string
}

// dont return undefined

export function textSizeTheme(props: TextSizeProps) {
  return getTextSizeTheme(props)
}

export function getTextSizeTheme(props: TextSizeProps, scale = 1) {
  const size = (props.size || 1) * scale
  const sizeLineHeight = (props.sizeLineHeight === true ? 1 : props.sizeLineHeight || 1) * scale
  let fontSize = props.fontSize
  if (typeof fontSize === 'undefined' && props.size) {
    fontSize = size * 14
  }
  let styles: TextStyles | null = null
  let lineHeight = props.lineHeight
  if (typeof lineHeight === 'undefined' && typeof fontSize === 'number') {
    lineHeight = Math.log(fontSize * 500) * 2.25 + fontSize / 1.4 - 9.5
    lineHeight = lineHeight * sizeLineHeight
  }
  let fontSizeNum
  let lineHeightNum
  // find defaults and round them
  if (typeof fontSize === 'number') {
    fontSizeNum = Math.round(fontSize)
    styles = styles || {}
    styles.fontSizeNum = fontSizeNum
  }
  if (typeof lineHeight === 'number') {
    lineHeightNum = Math.round(lineHeight * 10) / 10
    styles = styles || {}
    styles.lineHeightNum = lineHeightNum
  }
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
  if (fontSize) {
    styles = styles || {}
    styles.fontSize = fontSize
  }
  if (lineHeight) {
    styles = styles || {}
    styles.lineHeight = lineHeight
  }
  return styles
}
