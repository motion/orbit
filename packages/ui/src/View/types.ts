import { GlossPropertySet } from '@o/css'
import { MotionProps, MotionTransform, Transition } from 'framer-motion'
import { AlphaColorProps, CSSPropertySet, CSSPropertySetStrict, PseudoStyleProps, TextSizeProps } from 'gloss'
import React from 'react'

import { AnimationStore } from '../Geometry'
import { Size } from '../Space'
import { CommonViewProps } from './CommonViewProps'
import { ElevatableProps } from './elevation'
import { PaddingProps } from './PaddedView'
import { MarginProps } from './View'

/**
 * The types here prevent cycles, we have a few between PaddedView/ScrollbaleView/View if not
 */

// these are used to filter out all the "excess" props for docs generation
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

// TODO further simplify and standardize props, instead of using HTML props
// so we move them more towards native like react-native-web
// for now adapted from gloss/Base.tsx
type CommonHTMLProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | 'title'
  | 'about'
  | 'accessKey'
  | 'autoCapitalize'
  | 'autoCorrect'
  | 'autoSave'
  | 'vocab'
  | 'typeof'
  | 'suppressHydrationWarning'
  | 'suppressContentEditableWarning'
  | 'spellCheck'
  | 'security'
  | 'slot'
  | 'results'
  | 'resource'
  | 'prefix'
  | 'property'
  | 'radioGroup'
  | 'contextMenu'
  | 'dir'
  | 'datatype'
  | 'inlist'
  | 'itemID'
  | 'lang'
  | 'is'
  | 'itemScope'
  | 'inputMode'
  | 'color'
  | 'size'
  | 'padding'
  | 'margin'
>

type MotionCompatCommonProps = Omit<
  CommonHTMLProps,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'style'
>

export type OrbitMotionTransform = {
  [P in keyof MotionTransform]: MotionTransform[P] | AnimationStore
}

export type ViewBaseProps = MotionCompatCommonProps &
  PseudoStyleProps &
  TextSizeProps &
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
export type OrbitCSSPropertyAnimation = {
  [P in keyof OrbitCSSPropertySet]: OrbitCSSPropertySet[P] | AnimationStore
}

export type ViewProps = Omit<ViewBaseProps, 'direction'> &
  // be sure to omit margin/padding
  Omit<OrbitCSSPropertyAnimation, 'direction'> & {
    direction?: 'horizontal' | 'vertical' | OrbitCSSPropertySet['direction']
    transition?: CSSPropertySetStrict['transition'] | Transition
  }

export type ViewThemeProps = ViewBaseProps & GlossPropertySet

export type ViewCSSProps = GlossPropertySet

export type ScrollableViewProps = Omit<ViewProps, 'flexFlow'> & {
  hideScrollbars?: boolean
  scrollable?: boolean | 'x' | 'y'
  parentSpacing?: Size
}
