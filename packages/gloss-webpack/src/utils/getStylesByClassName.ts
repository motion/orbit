import { CacheObject } from '../types'
import { getClassNameFromCache } from './getClassNameFromCache'

// TODO from gloss
type CSSProperties = any

const nonStyleProps = {
  children: true,
  className: true,
  component: true,
  props: true,
  style: true,
}

interface JsxstyleProps extends CSSProperties {
  mediaQueries?: Record<string, string>
  props?: Record<string, any>
}

export interface StylesByClassName {
  [key: string]: JsxstyleProps
}

export function getStylesByClassName(
  staticAttributes: Record<string, any>,
  cacheObject: CacheObject,
): StylesByClassName {
  if (typeof staticAttributes !== 'undefined' && staticAttributes == null) {
    throw new Error('getStylesByClassName expects an object as its second parameter')
  }

  if (cacheObject == null) {
    throw new Error('getStylesByClassName expects an object as its third parameter')
  }

  let hasItems = false
  const styleProps = {}
  for (const item in staticAttributes) {
    if (nonStyleProps.hasOwnProperty(item) || !staticAttributes.hasOwnProperty(item)) {
      continue
    }
    hasItems = true
    styleProps[item] = staticAttributes[item]
  }

  if (!hasItems) {
    return {}
  }

  const stylesByClassName: StylesByClassName = {}

  if (Object.keys(styleProps).length > 0) {
    const className = getClassNameFromCache(styleProps, cacheObject)
    if (className) {
      stylesByClassName[className] = styleProps
      if (staticAttributes.mediaQueries) {
        stylesByClassName[className].mediaQueries = staticAttributes.mediaQueries
      }
    }
  }

  return stylesByClassName
}
