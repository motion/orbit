import { GlossPropertySet } from '@o/css'
import { AlphaColorProps, Base, CSSPropertySetStrict, gloss, GlossProps, PseudoStyleProps, TextSizeProps } from 'gloss'
import { SpringValue } from 'react-spring'

import { Sizes } from '../Space'
import { Omit } from '../types'
import { ElevatableProps, getElevation } from './elevate'
import { getPadding, getSizableValue, PaddingProps, SizesObject } from './pad'

// TODO further simplify and standardize props, instead of using HTML props
// so we can unify eventually with native
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
  }

export type ViewProps = ViewBaseProps &
  // be sure to omit margin/padding
  Omit<CSSPropertyStrictWithAnimation, 'margin' | 'padding'>

type ViewThemeProps = ViewBaseProps & GlossPropertySet

export type ViewCSSProps = GlossPropertySet

export const View = gloss<ViewProps, ViewThemeProps>(Base, {
  display: 'flex',
}).theme(getMargin, getPadding, getElevation)

// margin

export type MarginProps = {
  margin?: Sizes | SizesObject | GlossPropertySet['margin']
}

export function getMargin(props: MarginProps) {
  if (props.margin) {
    return { margin: getSizableValue(props.margin) }
  }
}
