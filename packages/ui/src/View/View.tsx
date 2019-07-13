import { GlossPropertySet } from '@o/css'
import { AnimatedInterpolation, AnimatedValue } from '@react-spring/animated'
import { AlphaColorProps, Base, CSSPropertySetStrict, gloss, GlossProps, PseudoStyleProps, TextSizeProps } from 'gloss'
import React, { forwardRef } from 'react'
import { animated, SpringValue } from 'react-spring'

import { Sizes } from '../Space'
import { ElevatableProps, getElevation } from './elevation'
import { getSizableValue, PaddingProps, SizesObject, usePadding } from './pad'

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

type ViewThemeProps = ViewBaseProps & GlossPropertySet

export type ViewCSSProps = GlossPropertySet

// export const View = ViewBase
// export const View = forwardRef((props: ViewProps, ref) => {
//   const Component = props.animated ? ViewBaseAnimated : ViewBase
//   const style = props.animated ? getAnimatedStyleProp(props) : props.style
//   if (props.style && props.style.debug) {
//     debugger
//   }
//   return (
//     <Component
//       ref={ref}
//       {...props}
//       style={style}
//       data-is={props['data-is'] || (props.animated ? `ViewAnimated` : `View`)}
//     />
//   )
// })

// regular view
export const View = gloss<ViewProps, ViewThemeProps>(Base, {
  display: 'flex',
})
  .theme(getMargin, usePadding, getElevation)
  .withConfig({
    getExtraProps(props) {
      if (!props.animated) {
        return null
      }
      const animatedStyles = getAnimatedStyleProp(props)
      if (!props.style) {
        return { style: animatedStyles }
      }
      return { style: { ...props.style, ...animatedStyles } }
    },
    getElement(props) {
      return props.animated ? animated[props.tagName] || animated.div : props.tagName || 'div'
    },
  })

export type MarginProps = {
  margin?: Sizes | SizesObject | GlossPropertySet['margin']
}

export function getMargin(props: MarginProps) {
  if (props.margin) {
    return { margin: getSizableValue(props.margin) }
  }
}

// find react-spring animated props
export const getAnimatedStyleProp = props => {
  let style = props.style
  for (const key in props) {
    if (key === 'scrollLeft' || key === 'scrollTop') {
      continue
    }
    const val = props[key]
    if (val instanceof AnimatedInterpolation || val instanceof AnimatedValue) {
      style = style || {}
      style[key] = val
    }
  }
  return style
}
