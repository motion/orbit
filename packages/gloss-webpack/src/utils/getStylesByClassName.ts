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
  styleGroups: CSSProperties[] = [],
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

  if (styleGroups) {
    arrayLoop: for (let idx = -1, len = styleGroups.length; ++idx < len; ) {
      const styleObject = styleGroups[idx]
      for (const prop in styleObject) {
        if (!styleProps.hasOwnProperty(prop) || styleProps[prop] !== styleObject[prop]) {
          // skip to the next style object
          continue arrayLoop
        }
      }

      const className = getClassNameFromCache(styleObject, cacheObject)
      if (!className) {
        continue arrayLoop
      }

      // if we're made it this far, all the style props in styleObject are present in styleProps.
      // delete props from styleObject and add them to a new style object with the provided key.
      stylesByClassName[className] = {}
      for (const prop in styleObject) {
        // since we're already looping through styleObject, clone the object here instead of using object.assign
        stylesByClassName[className][prop] = styleObject[prop]
        delete styleProps[prop]
      }
      if (staticAttributes.mediaQueries) {
        stylesByClassName[className].mediaQueries = staticAttributes.mediaQueries
      }
    }
  }

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
