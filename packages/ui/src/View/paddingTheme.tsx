import { isDefined } from '@o/utils'
import { ThemeFn } from 'gloss'

import { hasMediaQueries, mediaQueryKeys } from '../mediaQueryKeys'
import { getSizableValue } from './getSizableValue'
import { PaddingProps } from './PaddedView'

type PaddingThemeProps = PaddingProps & {
  paddingTop?: any
  paddingLeft?: any
  paddingRight?: any
  paddingBottom?: any
}

export const paddingTheme: ThemeFn<PaddingThemeProps> = (props) => {
  const res: any = {}
  // TODO only iterate props here rather than iterate possible media query keys
  // why? assuming static compiled optimizations we have less props on average
  // base padding
  const base = getPaddingBaseValue(props.padding)
  for (const key of paddingSides) {
    const val = getPaddingSideValue(base, props, paddingSides, key)
    if (isDefined(val)) {
      res[key] = val
    }
  }
  // media query padding
  if (hasMediaQueries) {
    let basePaddings = null
    let mediaQueries = new Set<string>()
    for (const key in props) {
      if (!isDefined(props[key]))
        continue
      if (key in mediaQueryKeysPadding) {
        basePaddings = basePaddings || {}
        const mediaKey = key.replace('-padding', '')
        basePaddings[mediaKey] = getPaddingBaseValue(props[key])
        // ensure we next go over the sides and add them
        mediaQueries.add(mediaKey)
      }
      if (key in mediaQueryKeysPaddingSides) {
        mediaQueries.add(key.replace('-padding', ''))
      }
    }
    if (mediaQueries.size) {
      for (const key of [...mediaQueries]) {
        const base = basePaddings?.[key]
        const sides = mediaQueryKeysPaddingSides[key]
        for (const sideKey of sides) {
          // fallback always to base because we are overriding
          const val = getPaddingSideValue(base, props, sides, sideKey) ?? base
          if (isDefined(val)) {
            res[sideKey] = val
          }
        }
      }
    }
  }
  return res
}

const paddingSides = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
const mediaQueryKeysPadding = mediaQueryKeys
  .map(key => `${key}-padding`)
  .reduce((acc, cur) => {
    acc[cur] = true
    return acc
  }, {})
const mediaQueryKeysPaddingSides: {
  [key: string]: string[]
} = mediaQueryKeys.reduce((acc, cur) => {
  acc[cur] = [
    `${cur}-paddingTop`,
    `${cur}-paddingRight`,
    `${cur}-paddingBottom`,
    `${cur}-paddingLeft`,
  ]
  return acc
}, {})

function getPaddingBaseValue(value: any) {
  const res = getSizableValue(value)
  return Array.isArray(res)
    ? res.map(x => (typeof x === 'number' && x > 0 ? `calc(${x}px * var(--scale))` : x))
    : typeof res === 'number'
      ? res > 0
        ? `calc(${res}px * var(--scale))`
        : res
      : res
}

function getPaddingSideValue(base: Object | undefined, props: PaddingThemeProps, sideKeys: string[], key: string) {
  if (isDefined(props[key])) {
    return getSizableValue(props[key])
  }
  if (base) {
    const keyIndex = sideKeys.indexOf(key)
    if (Array.isArray(base)) {
      // account for shorthand
      if (base.length - 1 < keyIndex) {
        return base[keyIndex % 2]
      }
      return base[keyIndex]
    }
    return base
  }
}
