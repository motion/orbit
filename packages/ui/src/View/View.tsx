import { GlossPropertySet } from '@o/css'
import { motion } from 'framer-motion'
import { Base, gloss } from 'gloss'

import { AnimationStore } from '../Geometry'
import { Sizes } from '../Space'
import { getElevation } from './elevation'
import { getSizableValue } from './getSizableValue'
import { usePadding } from './PaddedView'
import { SizesObject, ViewProps, ViewThemeProps } from './types'

export const motionStyleProps = {
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

const motionExtraProps = {
  animate: true,
  exit: true,
  drag: true,
  dragConstraints: true,
  dragElastic: true,
  onDragEnd: true,
  variants: true,
  custom: true,
  initial: true,
  transition: true,
  whileHover: true,
  whileTap: true,
}

// includes motion styles too
export const motionProps = {
  ...motionStyleProps,
  ...motionExtraProps,
}

const shouldRenderToMotion = (props: any) => props.animate || props.drag

// regular view
export const View = gloss<ViewProps, ViewThemeProps>(Base, {
  display: 'flex',
})
  .theme(getMargin, usePadding, getElevation)
  .withConfig({
    postProcessProps(inProps, outProps, tracker) {
      if (shouldRenderToMotion(inProps)) {
        let style = inProps.style || {}
        let finalClassName = inProps.className
        // parse style back from classname to style tag for motion
        if (outProps.className) {
          finalClassName = ''
          for (const name of outProps.className.split(' ')) {
            if (tracker.has(name)) {
              const rules = tracker.get(name).rules
              Object.assign(style, rules)
            } else {
              finalClassName += ` ${name}`
            }
          }

          for (const key in inProps) {
            const val = inProps[key]
            if (motionStyleProps[key]) {
              if (val instanceof AnimationStore) {
                if (val.values.length) {
                  style[key] = val.getValue()
                }
              } else {
                style[key] = val
              }
              delete outProps[key]
            }
            if (motionExtraProps[key]) {
              if (key === 'animate' && inProps.animate === true) {
                continue
              }
              outProps[key] = val
            }
          }
        }
        outProps.className = finalClassName
        outProps.style = style
        outProps['data-is'] = `${outProps['data-is']} is-animated`
      }
    },
    isDOMElement: true,
    getElement(props) {
      return shouldRenderToMotion(props)
        ? motion[props.tagName] || motion.div
        : props.tagName || 'div'
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
