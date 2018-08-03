type TextStyles = {
  fontSize?: string | number
  lineHeight?: string | number
  lineHeightNum?: number
  fontSizeNum?: number
}

// dont return undefined

export const propsToTextSize = props => {
  let fontSize = props.fontSize
  if (typeof fontSize === 'undefined' && props.size) {
    fontSize = props.size * 14
  }
  let styles: TextStyles = {}
  let lineHeight = props.lineHeight
  if (typeof lineHeight === 'undefined' && typeof fontSize === 'number') {
    lineHeight = Math.log(fontSize * 500) * 2.5 + fontSize / 1.4 - 8
    if (props.sizeLineHeight) {
      lineHeight = lineHeight * props.sizeLineHeight
    }
  }
  let fontSizeNum
  let lineHeightNum
  // find defaults and round them
  if (typeof fontSize === 'number') {
    fontSizeNum = Math.round(fontSize * 10) / 10
    styles.fontSizeNum = fontSizeNum
  }
  if (typeof lineHeight === 'number') {
    lineHeightNum = Math.round(lineHeight * 10) / 10
    styles.lineHeightNum = lineHeightNum
  }
  if (typeof lineHeightNum === 'number') {
    if (typeof props.sizeMethod === 'undefined') {
      lineHeight = `${lineHeightNum}px`
      fontSize = `${fontSizeNum}px`
    } else if (props.sizeMethod === 'vw') {
      lineHeight = `${lineHeightNum / 12}vw`
      fontSize = `${fontSizeNum / 12}vw`
    }
  }
  if (fontSize) {
    styles.fontSize = fontSize
  }
  if (lineHeight) {
    styles.lineHeight = lineHeight
  }
  return styles
}
