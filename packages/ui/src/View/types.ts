import { GlossPropertySet } from '@o/css'
import { MotionProps, MotionTransform, Transition } from 'framer-motion'
import { AlphaColorProps, CommonHTMLProps, CSSPropertySet, CSSPropertySetStrict, GlossProps } from 'gloss'
import React from 'react'

import { AnimationStore } from '../Geometry'
import { Size } from '../Space'
import { TextSizeProps } from '../text/textSizeTheme'
import { CommonViewProps } from './CommonViewProps'
import { ElevatableProps } from './elevation'
import { MarginProps } from './marginTheme'
import { PaddingProps } from './PaddedView'

/**
 * The types here prevent cycles, we have a few between PaddedView/ScrollbaleView/View if not
 */

// these are used to filter out all the "excess" props for docs generation
// TODO why am i not seeing this in grep?
export type BaseViewProps = CommonHTMLProps & CommonViewProps
export const BaseViewProps = (props: BaseViewProps) => props.children
export const BaseCSSProps = (props: CSSPropertySet) => props.children

export type SizesObject = {
  top?: Size
  left?: Size
  bottom?: Size
  right?: Size
  x?: Size
  y?: Size
}

export type OrbitMotionTransform = {
  [P in keyof MotionTransform]: MotionTransform[P] | AnimationStore
}

export type ViewBaseProps = TextSizeProps &
  AlphaColorProps &
  ElevatableProps &
  MarginProps &
  PaddingProps &
  /** Accept the motion props */
  Omit<MotionProps, 'animate' | 'transition' | 'padding'> &
  OrbitMotionTransform & {
    // could make this better done in terms of type flow, its for <Input labels...
    label?: React.ReactNode
    // allow boolean toggle animate too
    animate?: boolean | MotionProps['animate']
  }

export type OrbitCSSPropertySet = Omit<CSSPropertySetStrict, 'margin' | 'padding' | 'transition'>

// add in the AnimationStores for any prop (motion accepts it)
// for now lets limit to not all to avoid pain in having to handle AnimationStore in many higher level views
// for example Section wants to use height/maxHeight etc in style={{}} and not have to check every value
// and we don't watn to animate height/maxHeight almost ever (layout problems) so dont do that
// plus in general want to only animate things that aren't too expensive
type ExtraAnimatableProperties =
  | 'background'
  | 'color'
  | 'border'
  | 'borderColor'
  | 'backgroundColor'
  | 'opacity'

export type OrbitCSSPropertyAnimation = {
  [P in ExtraAnimatableProperties]?: OrbitCSSPropertySet[P] | AnimationStore
}

export type ViewPropsPlain = Omit<ViewBaseProps, 'direction'> &
  // be sure to omit margin/padding
  Omit<OrbitCSSPropertyAnimation, 'direction'> & {
    direction?: 'horizontal' | 'vertical' | OrbitCSSPropertySet['direction']
    transition?: CSSPropertySetStrict['transition'] | Transition
  }

export type ViewProps = GlossProps<ViewPropsPlain>

export type ViewThemeProps = ViewBaseProps & GlossPropertySet

export type ViewCSSProps = GlossPropertySet

export type ScrollablePropVal = boolean | 'x' | 'y'

export type ScrollableViewProps = Omit<ViewProps, 'flexFlow'> & {
  hideScrollbars?: boolean
  scrollable?: ScrollablePropVal
  parentSpacing?: Size
}
