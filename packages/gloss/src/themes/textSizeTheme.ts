export type TextSizeProps = {
  sizeFont?: boolean | number
  sizeLineHeight?: boolean | number
  lineHeight?: number | string | any
  fontSize?: number | string | any
  size?: number
  scale?: number
  marginTop?: number
  marginBottom?: number
}

// dont return undefined

export type TextSizeConfig = {
  scale?: number
  size?: number
}

declare const CSS: any

export function getTextSizeTheme(props: TextSizeProps) {
  const scale = CSS.var(props.scale, 1)
  const size = CSS.var(props.size, 1)
  const sizeFont = CSS.var(props.sizeFont === true ? 1 : props.sizeFont || 1)
  const sizeLineHeight = CSS.var(props.sizeLineHeight === true ? 1 : props.sizeLineHeight || 1)
  const lineHeight = CSS.add(CSS.mult(size, scale, sizeLineHeight, 14), 4)
  const marginV = CSS.px(CSS.mult(lineHeight, -0.15))
  return {
    fontSize: CSS.px(CSS.calc(CSS.mult(size, scale, sizeFont, 14))),
    lineHeight: CSS.px(lineHeight),
    marginTop: marginV,
    marginBottom: marginV,
  }

  // const scale = (extraProps && extraProps.scale) || 1
  // const size = ((extraProps && extraProps.size) || props.size || 1) * scale
  // const sizeFont = props.sizeFont === true ? 1 : props.sizeFont || 1
  // const sizeLineHeight = (props.sizeLineHeight === true ? 1 : props.sizeLineHeight || 1) * scale
  // const specifiedFontSize = typeof props.fontSize !== 'undefined'
  // let fontSize = props.fontSize
  // // round fontsize/lineHeight the same direction
  // let shouldRoundUp = false
  // if (!specifiedFontSize) {
  //   fontSize = size * 14
  //   fontSize = sizeFont * fontSize
  //   shouldRoundUp = fontSize % 1 >= 0.5
  //   fontSize = Math.round(fontSize)
  // }
  // let styles: TextStyles | null = null
  // let lineHeight = props.lineHeight
  // if (typeof lineHeight === 'undefined' && typeof fontSize === 'number') {
  //   lineHeight = Math.log(fontSize * 500) * 2.25 + fontSize / 1.4 - 9.5
  //   lineHeight = lineHeight * sizeLineHeight
  //   lineHeight = shouldRoundUp ? Math.ceil(lineHeight) : Math.floor(lineHeight)
  // }
  // if (lineHeight) {
  //   styles = styles || {}
  //   styles.lineHeight = lineHeight
  //   // we only want lineHeight to affect the "in between lines"
  //   // in CSS by default it also adds padding above/below single-line text
  //   // so we remove that spacing by default here
  //   // TODO (gloss scales default line height to 14, we can make that adjustable)
  //   // CONST of lineHeight seems to be the proper amount to avoid the extra spacing
  //   styles.marginTop = -sizeLineHeight * 14 * LINE_HEIGHT_EXTRA_SCALE
  //   styles.marginBottom = -sizeLineHeight * 14 * LINE_HEIGHT_EXTRA_SCALE
  // } else {
  //   console.log(
  //     'inherited, can we either do negative margin using relative units, or contextually pass down inherited font size',
  //   )
  // }
  // return styles
}

// const LINE_HEIGHT_EXTRA_SCALE = 0.15
