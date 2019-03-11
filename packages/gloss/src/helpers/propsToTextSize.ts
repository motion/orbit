type TextStyles = {
  fontSize?: string | number
  lineHeight?: string | number
  lineHeightNum?: number
  fontSizeNum?: number
}

export type TextSizeProps = {
  sizeLineHeight?: number
  lineHeight?: number | string
  fontSize?: number | string
  size?: number
  sizeMethod?: string
}

// dont return undefined

export function propsToTextSize(props: TextSizeProps) {
  let fontSize = props.fontSize
  if (typeof fontSize === 'undefined' && props.size) {
    fontSize = props.size * 14
  }
  let styles: TextStyles | null = null
  let lineHeight = props.lineHeight
  if (typeof lineHeight === 'undefined' && typeof fontSize === 'number') {
    lineHeight = Math.log(fontSize * 500) * 2.25 + fontSize / 1.4 - 9.5
    if (props.sizeLineHeight) {
      lineHeight = lineHeight * props.sizeLineHeight
    }
  }
  let fontSizeNum
  let lineHeightNum
  // find defaults and round them
  if (typeof fontSize === 'number') {
    fontSizeNum = Math.round(fontSize * 10) / 10
    styles = styles || {}
    styles.fontSizeNum = fontSizeNum
  }
  if (typeof lineHeight === 'number') {
    lineHeightNum = Math.round(lineHeight * 10) / 10
    styles = styles || {}
    styles.lineHeightNum = lineHeightNum
  }
  if (typeof lineHeightNum === 'number') {
    if (typeof props.sizeMethod === 'undefined') {
      lineHeight = `${lineHeightNum}px`
      fontSize = `${fontSizeNum}px`
    } else if (props.sizeMethod === 'vw') {
      lineHeight = `${lineHeightNum / 12}vw`
      fontSize = `${fontSizeNum / 12}vw`
    } else {
      lineHeight = `${lineHeightNum}${props.sizeMethod}`
      fontSize = `${fontSizeNum}${props.sizeMethod}`
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
