import { GlossPropertySet } from '@o/css'
import { Box, gloss } from 'gloss'

import { Sizes } from '../Space'
import { paddingTheme } from './paddingTheme'
import { ScrollableViewProps, SizesObject, ViewPropsPlain } from './types'
import { wrappingSpaceTheme } from './wrappingSpaceTheme'

export type PaddingProps = {
  padding?: Sizes | SizesObject | GlossPropertySet['padding']
}

export type PaddedViewProps = ViewPropsPlain &
  Pick<ScrollableViewProps, 'scrollable' | 'parentSpacing'> & {
    isWrapped?: boolean
  }

export const PaddedView = gloss<PaddedViewProps>(Box, {
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
  paddingTheme,
  wrappingSpaceTheme,
)
