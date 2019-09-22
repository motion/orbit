import { getStylesClassName } from 'gloss'
import { CSSProperties } from 'jsxstyle-utils'

import { CacheObject } from '../types'

export function getClassNameFromCache(
  styleObject: CSSProperties,
  cacheObject: CacheObject,
): string | null {
  if (cacheObject == null) {
    throw new Error('getClassNameFromCache expects an object as its second parameter')
  }

  if (!styleObject || typeof styleObject !== 'object') {
    console.warn('getClassNameFromCache received an invalid styleObject as its first parameter')
    return null
  }

  if (Object.keys(styleObject).length === 0) {
    return null
  }

  return getStylesClassName('.', styleObject as any).className
}
