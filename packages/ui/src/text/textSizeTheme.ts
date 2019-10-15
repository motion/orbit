import { isDefined } from '@o/utils'

import { hasMediaQueries, mediaQueryKeysSize } from '../mediaQueryKeys'
import { getTextSize } from '../Sizes'
import { Size } from '../Space'

export type TextSizeProps = {
  sizeFont?: boolean | number
  sizeLineHeight?: boolean | number
  lineHeight?: Size
  fontSize?: Size
  size?: Size
  scale?: Size
  marginTop?: number
  marginBottom?: number
}

export function textSizeTheme(props: TextSizeProps) {
  const res = getTextSizeTheme(props)

  // media query size
  if (hasMediaQueries) {
    for (const key in mediaQueryKeysSize) {
      if (isDefined(props[key])) {
        const mediaKey = key.replace('-size', '')
        const mediaSizeVal = props[key]
        const mediaSize = getTextSize(mediaSizeVal)
        const mediaStyles = getTextSizeTheme({
          scale: props.scale,
          size: mediaSize
        })
        for (const textKey in mediaStyles) {
          res[`${mediaKey}-${textKey}`] = mediaStyles[textKey]
        }
      }
    }
  }

  return res
}

const booleanToNumber = (val: boolean | number): number => {
  return val === true ? 1 : val === false ? 0 : val
}

function getTextSizeTheme(props: TextSizeProps) {
  const sizeVal = getTextSize(props.size) ?? 1
  const baseFontSize = 14
  const baseLineHeight = 14 * 1.35
  const extraLineHeight = CSS.px(6)
  const size = CSS.px(sizeVal)
  const scale = 'var(--scale)'
  const sizeFont = booleanToNumber(props.sizeFont ?? 1)
  const sizeLineHeight = booleanToNumber(props.sizeLineHeight ?? 1)
  const fontSizeInner = `${size} * ${scale} * ${baseFontSize} * ${sizeFont}`
  const fontSize = `calc(${fontSizeInner})`
  const lineHeight = `calc(${size} * ${scale} * ${baseLineHeight} * ${sizeLineHeight} + ${extraLineHeight})`
  const marginV = `calc(${fontSizeInner} * -0.14)`
  if (props.fontSize) console.log('got em', props.fontSize)
  return {
    fontSize: props.fontSize || fontSize,
    lineHeight: props.lineHeight || lineHeight,
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
