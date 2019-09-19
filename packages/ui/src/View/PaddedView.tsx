import { GlossPropertySet } from '@o/css'
import { isDefined } from '@o/utils'
import { Box, gloss } from 'gloss'

import { hasMediaQueries, mediaQueryKeys } from '../mediaQueryKeys'
import { useScale } from '../Scale'
import { Sizes } from '../Space'
import { getSizableValue } from './getSizableValue'
import { ScrollableViewProps, SizesObject, ViewProps } from './types'
import { wrappingSpaceTheme } from './wrappingSpaceTheme'

export type PaddingProps = {
  padding?: Sizes | SizesObject | GlossPropertySet['padding']
}

export const PaddedView = gloss<
  ViewProps &
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
  maxHeight: '-webkit-fill-available',
}).theme(
  props => ({
    flex: props.flex,
    ...(!props.scrollable && { maxWidth: '100%' }),
    ...(props.scrollable === 'x' && { maxHeight: '100%' }),
    ...(props.scrollable === 'y' && { maxWidth: '100%' }),
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

  if (props.padding === 'disable-padding') {
    return null
  }

  const res: any = {}

  // base padding
  const base = getPaddingBaseValue(props.padding, scale)
  for (const key of paddingSides) {
    const val = getPaddingSideValue(base, props, paddingSides, key)
    console.log('now we gots', key, val)
    if (isDefined(val)) {
      res[key] = val
    }
  }

  // media query padding
  // warning: this is probably too expensive for now... we should iterate over props instead
  if (hasMediaQueries) {
    let basePaddings = null
    for (const key in mediaQueryKeysPadding) {
      if (isDefined(props[key])) {
        basePaddings = basePaddings || {}
        basePaddings[key.replace('-padding', '')] = getPaddingBaseValue(props[key], scale)
      }
    }

    for (const mediaKey in mediaQueryKeysPaddingSides) {
      const sides = mediaQueryKeysPaddingSides[mediaKey]
      for (const paddingSide of sides) {
        if (isDefined(props[paddingSide])) {
          res[paddingSide] = getPaddingSideValue(
            basePaddings ? basePaddings[mediaKey] : undefined,
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
