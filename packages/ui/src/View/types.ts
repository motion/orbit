import { GlossPropertySet } from '@o/css'
import { AlphaColorProps, CSSPropertySet, CSSPropertySetStrict, GlossProps, PseudoStyleProps, TextSizeProps } from 'gloss'
import React from 'react'
import { SpringValue } from 'react-spring'

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
>

// BUT WERE CHANGING IT TO ACCEPT ANIMATED VALUES FOR ANY CSS PROPERTY
// WE DONT PASS THIS TO THEMES
type CSSPropertyStrictWithAnimation = {
  [P in keyof CSSPropertySetStrict]?: CSSPropertySetStrict[P] | SpringValue
}

export type ViewBaseProps = GlossProps<CommonHTMLProps> &
  PseudoStyleProps &
  TextSizeProps &
  AlphaColorProps &
  ElevatableProps &
  MarginProps &
  PaddingProps & {
    // could make this better done in terms of type flow, its for <Input labels...
    label?: React.ReactNode
    /** Will take animated springs used as properties and apply them as animations */
    animated?: boolean
  }

export type ViewProps = ViewBaseProps &
  // be sure to omit margin/padding
  Omit<CSSPropertyStrictWithAnimation, 'margin' | 'padding'>

export type ViewThemeProps = ViewBaseProps & GlossPropertySet

export type ViewCSSProps = GlossPropertySet
