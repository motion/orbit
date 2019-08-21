import { GlossPropertySet } from '@o/css'
import { selectDefined } from '@o/utils'
import { Base, gloss } from 'gloss'

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
>(Base, {
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

export function usePadding(
  props: PaddingProps & {
    paddingTop?: any
    paddingLeft?: any
    paddingRight?: any
    paddingBottom?: any
  },
) {
  const scale = useScale()
  let padding = getSizableValue(props.padding)
  padding = Array.isArray(padding)
    ? padding.map(x => (typeof x === 'number' ? x * scale : x))
    : typeof padding === 'number'
    ? padding * scale
    : padding
  const paddingObj = {
    paddingTop: selectDefined(props.paddingTop, padding[0], padding),
    paddingRight: selectDefined(props.paddingRight, padding[1], padding),
    paddingBottom: selectDefined(props.paddingBottom, padding[2], padding[0], padding),
    paddingLeft: selectDefined(props.paddingLeft, padding[3], padding[1], padding),
  }
  return paddingObj
}
