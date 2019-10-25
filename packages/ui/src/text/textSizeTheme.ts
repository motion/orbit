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
  // TODO this whole loop needs rethinking
  if (hasMediaQueries) {
    for (const key in mediaQueryKeysSize) {
      if (isDefined(props[key])) {
        const mediaKey = key.replace('-size', '')
        const mediaSizeVal = props[key]
        const mediaStyles = getTextSizeTheme({
          scale: props.scale,
          size: getTextSize(mediaSizeVal),
          sizeFont: props[mediaKey + '-sizeFont'] ?? props.sizeFont,
          sizeLineHeight: props[mediaKey + '-sizeLineHeight'] ?? props.sizeLineHeight,
        })
        for (const textKey in mediaStyles) {
          res[`${mediaKey}-${textKey}`] = mediaStyles[textKey]
        }
      }
    }
  }

  return res
}

textSizeTheme.hoistTheme = true

const booleanToNumber = (val: boolean | number): number => {
  return val === true ? 1 : val === false ? 0 : val
}

function getTextSizeTheme(props: TextSizeProps) {
  const sizeVal = getTextSize(props.size) ?? 1
  const baseFontSize = 14
  const size = `${sizeVal}px`
  const scale = 'var(--scale)'
  const sizeFont = booleanToNumber(props.sizeFont ?? 1)
  const sizeLineHeight = booleanToNumber(props.sizeLineHeight ?? 1)
  const fontSizeInner = `${size} * ${scale} * ${baseFontSize} * ${sizeFont}`
  const fontSize = `calc(${fontSizeInner})`
  const lineHeight = `calc(1.4em * ${scale} * ${sizeLineHeight})`
  const marginV = `calc(-0.12em * ${scale} * ${sizeLineHeight})`
  return {
    fontSize: props.fontSize || fontSize,
    lineHeight: props.lineHeight || lineHeight,
    marginTop: marginV,
    marginBottom: marginV,
  }
}
