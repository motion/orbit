import { GlossPropertySet } from '@o/css'
import { AnimatedInterpolation, AnimatedValue } from '@react-spring/animated'
import { Base, gloss } from 'gloss'
import { animated } from 'react-spring'

import { Sizes } from '../Space'
import { getElevation } from './elevation'
import { getSizableValue } from './getSizableValue'
import { usePadding } from './PaddedView'
import { SizesObject, ViewProps, ViewThemeProps } from './types'

// regular view
export const View = gloss<ViewProps, ViewThemeProps>(Base, {
  display: 'flex',
})
  .theme(getMargin, usePadding, getElevation)
  .withConfig({
    modifyProps(curProps, nextProps) {
      if (!curProps.animated) return
      const props = getAnimatedProps(curProps)
      if (props) {
        Object.assign(nextProps, props)
        // ensure will-change transform
        // nextProps.style = { ...nextProps.style, willChange: 'transform' }
      }
    },
    isDOMElement: true,
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
const isAnimatedVal = x => x instanceof AnimatedInterpolation || x instanceof AnimatedValue
export const getAnimatedProps = props => {
  let next = null
  for (const key in props) {
    if (props[key] && isAnimatedVal(props[key])) {
      next = next || {}
      if (key === 'scrollLeft' || key === 'scrollTop') {
        next[key] = props[key]
      } else {
        next.style = next.style || props.style || {}
        next.style[key] = props[key]
      }
    }
  }
  return next
}
