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
declare const CSSVariableReferenceValue: any
declare const CSSUnparsedValue: any
declare const CSSMathProduct: any
declare const CSSMathSum: any
declare const CSSMathMin: any
declare const CSSMathMax: any
declare const CSSMathNegate: any

class CSSValue {
  current: any = null
  constructor(initial: any, ...fallbacks: any) {
    this.current =
      initial[0] === '-' && initial[1] === '-'
        ? new CSSVariableReferenceValue(initial, new CSSUnparsedValue(fallbacks))
        : new CSSUnparsedValue(initial)
  }
  mult(...vals: any) {
    return new CSSMathProduct(this.current, ...vals)
  }
  sum(...vals: any) {
    return new CSSMathSum(this.current, ...vals)
  }
  negate() {
    return new CSSMathNegate(this.current)
  }
  min(val: any) {
    return new CSSMathMin(this.current, val)
  }
  max(val: any) {
    return new CSSMathMax(this.current, val)
  }
}

const val = (initial: any, ...values: any[]) => {
  return new CSSValue(initial, ...values)
}

export function getTextSizeTheme(props: TextSizeProps) {
  const scale = val(props.scale, 1)
  const size = val(props.size, 1)
  const sizeFont = val(props.sizeFont === true ? 1 : props.sizeFont || 1)
  const sizeLineHeight = val(props.sizeLineHeight === true ? 1 : props.sizeLineHeight || 1)
  const fontSize = size.mult(scale, size, sizeFont, 14)
  const lineHeight = size.mult(scale, size, sizeLineHeight, 14 * 1.2).add(4)
  const marginV = lineHeight.negate().mult(0.1)
  return {
    fontSize: CSS.px(fontSize),
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
