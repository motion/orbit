import { GlossPropertySet } from '@o/css'
import { isDefined } from '@o/utils'
import { Box, gloss } from 'gloss'

import { hasMediaQueries, mediaQueryKeys } from '../mediaQueryKeys'
import { useScale } from '../Scale'
import { Sizes } from '../Space'
import { getSizableValue } from './getSizableValue'
import { ScrollableViewProps, SizesObject, ViewPropsPlain } from './types'
import { wrappingSpaceTheme } from './wrappingSpaceTheme'

export type PaddingProps = {
  padding?: Sizes | SizesObject | GlossPropertySet['padding']
}

export const PaddedView = gloss<
  ViewPropsPlain &
    Pick<ScrollableViewProps, 'scrollable' | 'parentSpacing'> & {
      isWrapped?: boolean
    }
>(Box, {
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  // dont flex! this ruins the pad and width/height
  // use minHeight/minWidth instead
  // flex: 1,
  alignItems: 'inherit',
  justifyContent: 'inherit',
  overflow: 'inherit',
  // otherwise it "shrinks to fit" vertically and overflow will cut off
  minWidth: '100%',
  minHeight: 'min-content',
  // testing! this fixed <AppCard /> in api-grid demo where scrollable stops working
  // if you show messages in a room that has a lot, it wont scroll. my hope is this fixes it
  // without needing to do stupid things like add a prop to control PaddedView inside
  // but it broke the website big time, in a very odd bug during parallax
  // maxHeight: '-webkit-fill-available',
}).theme(
  props => ({
    flex: props.flex,
    minHeight: props.minHeight,
    maxWidth: props.scrollable === 'y' || !props.scrollable ? '100%' : undefined,
    maxHeight: props.scrollable === 'x' ? '100%' : undefined,
  }),
  usePadding,
  wrappingSpaceTheme,
)

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

type PaddingSpecificProps = PaddingProps & {
  paddingTop?: any
  paddingLeft?: any
  paddingRight?: any
  paddingBottom?: any
}

export function usePadding(props: PaddingSpecificProps) {
  const scale = useScale()

  if (props.padding === false) {
    return null
  }

  const res: any = {}

  // base padding
  const base = getPaddingBaseValue(props.padding, scale)
  for (const key of paddingSides) {
    const val = getPaddingSideValue(base, props, paddingSides, key)
    if (isDefined(val)) {
      res[key] = val
    }
  }

  // media query padding
  if (hasMediaQueries) {
    let basePaddings = null
    let sidePaddings = []
    for (const key in props) {
      if (!isDefined(props[key])) continue
      if (key in mediaQueryKeysPadding) {
        basePaddings = basePaddings || {}
        basePaddings[key.replace('-padding', '')] = getPaddingBaseValue(props[key], scale)
      }
      if (key in mediaQueryKeysPaddingSides) {
        sidePaddings.push(key)
      }
    }
    for (const key of sidePaddings) {
      const sides = mediaQueryKeysPaddingSides[key]
      for (const paddingSide of sides) {
        if (isDefined(props[paddingSide])) {
          res[paddingSide] = getPaddingSideValue(
            basePaddings ? basePaddings[key.slice(key.indexOf('-'))] : undefined,
            props,
            sides,
            paddingSide,
          )
        }
      }
    }
  }

  return res
}

function getPaddingBaseValue(value: any, scale: number) {
  const res = getSizableValue(value)
  return Array.isArray(res)
    ? res.map(x => (typeof x === 'number' ? x * scale : x))
    : typeof res === 'number'
    ? res * scale
    : res
}

function getPaddingSideValue(
  base: Object | undefined,
  props: PaddingSpecificProps,
  sideKeys: string[],
  key: string,
) {
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
    } else {
      return base
    }
  }
}
