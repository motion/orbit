import { getTextSizeTheme } from 'gloss'

import { hasMediaQueries, mediaQueryKeysSize } from '../mediaQueryKeys'
import { useScale } from '../Scale'
import { getTextSize } from '../Sizes'
import { Size } from '../Space'

export function scaledTextSizeTheme(props: any) {
  // scaling
  const scale = useScale()
  return getMediaQueryTextSizeTheme(props, { size: props.size, scale })
}

export function getMediaQueryTextSizeTheme(props: any, sizing: { scale: number; size: Size }) {
  const size = getTextSize(sizing.size)
  const res = getTextSizeTheme(props, { scale: sizing.scale, size })

  // media query size
  if (hasMediaQueries) {
    for (const key in mediaQueryKeysSize) {
      if (!!props[key]) {
        const mediaKey = key.replace('-size', '')
        const mediaSizeVal = props[key]
        const mediaSize = getTextSize(mediaSizeVal)
        const mediaStyles = getTextSizeTheme(props, { scale: sizing.scale, size: mediaSize })
        for (const textKey in mediaStyles) {
          res[`${mediaKey}-${textKey}`] = mediaStyles[textKey]
        }
      }
    }
  }

  if (res['fontSize'] === '35px' && res['sm-fontSize'] === '24px') {
    debugger
  }

  return res
}
