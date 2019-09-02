import { GlossPropertySet, validCSSAttr } from '@o/css'
import { AnimatedInterpolation, AnimatedValue } from '@react-spring/animated'
import { motion } from 'framer-motion'
import { Base, gloss } from 'gloss'

import { Sizes } from '../Space'
import { getElevation } from './elevation'
import { getSizableValue } from './getSizableValue'
import { usePadding } from './PaddedView'
import { SizesObject, ViewProps, ViewThemeProps } from './types'

// includes motion styles too
export const motionProps = {
  x: true,
  y: true,
  z: true,
  translateX: true,
  translateY: true,
  translateZ: true,
  rotate: true,
  rotateX: true,
  rotateY: true,
  rotateZ: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  scaleZ: true,
  skew: true,
  skewX: true,
  skewY: true,
  originX: true,
  originY: true,
  originZ: true,
  perspective: true,
}
const validStyleAttr = {
  ...validCSSAttr,
  ...motionProps,
}

// regular view
export const View = gloss<ViewProps, ViewThemeProps>(Base, {
  display: 'flex',
})
  .theme(getMargin, usePadding, getElevation)
  .withConfig({
    postProcessProps(inProps, outProps, tracker) {
      if (inProps.animate) {
        let style = inProps.style || {}
        let finalClassName = inProps.className
        // parse style back from classname to style tag for motion
        if (outProps.className) {
          finalClassName = ''
          for (const name of outProps.className.split(' ')) {
            if (tracker.has(name)) {
              Object.assign(style, tracker.get(name).rules)
            } else {
              finalClassName += ` ${name}`
            }
          }

          for (const key in inProps) {
            if (motionProps[key]) {
              style[key] = inProps[key]
              delete outProps[key]
            }
          }
        }
        outProps.className = finalClassName
        outProps.style = style
      }
    },
    isDOMElement: true,
    getElement(props) {
      // todo make it not require animate
      return props.animate ? motion[props.tagName] || motion.div : props.tagName || 'div'
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
