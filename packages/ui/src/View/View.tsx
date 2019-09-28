import { css, GlossPropertySet } from '@o/css'
import { motion } from 'framer-motion'
import { Base, gloss } from 'gloss'
import { partition } from 'lodash'

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

// todo we can probably get rid of this by just not having isDOMElement? or some new flag
const motionExtraProps = {
  animate: true,
  custom: true,
  drag: true,
  dragConstraints: true,
  dragElastic: true,
  dragMomentum: true,
  dragPropagation: true,
  dragTransition: true,
  exit: true,
  initial: true,
  layoutTransition: true,
  onAnimationComplete: true,
  onAnimationEnd: true,
  onAnimationStart: true,
  onDirectionLock: true,
  onDrag: true,
  onDragEnd: true,
  onDragStart: true,
  onHoverEnd: true,
  onHoverStart: true,
  onPan: true,
  onPanEnd: true,
  onPanStart: true,
  onTap: true,
  onTapCancel: true,
  onTapStart: true,
  onUpdate: true,
  positionTransition: true,
  transformTemplate: true,
  transition: true,
  variants: true,
  whileHover: true,
  whileTap: true,
  useInvertedScale: true,
}

// includes motion styles too
export const motionProps = {
  ...motionStyleProps,
  ...motionExtraProps,
}

const shouldRenderToMotion = (props: any) =>
  'animate' in props || 'drag' in props || 'layoutTransition' in props

// regular view
export const View = gloss<ViewProps, ViewThemeProps>(Base, {
  display: 'flex',
})
  .theme(getMargin, usePadding, getElevation)
  .withConfig({
    postProcessProps(inProps, outProps, tracker) {
      if (shouldRenderToMotion(inProps)) {
        let style = {}

        let finalClassName = inProps.className

        // parse style back from classname to style tag for motion
        if (outProps.className) {
          finalClassName = ''
          const [specific, nonSpecific] = partition(
            outProps.className.split(' '),
            x => x[0] === 's',
          )
          // order them so specific gets most importance
          for (const name of [...nonSpecific, ...specific]) {
            const key = name[0] === 's' ? name.slice(1) : name
            if (tracker.has(key)) {
              const styles = tracker.get(key)
              if (styles.namespace == '.') {
                if (!styles.styleObject) {
                  styles.styleObject = css(styles.rules, { snakeCase: false })
                }
                Object.assign(style, styles.styleObject)
              } else {
                finalClassName += ` ${name}`
              }
            } else {
              finalClassName += ` ${name}`
            }
          }
        }

        for (const key in inProps) {
          const val = inProps[key]
          if (val instanceof AnimationStore) {
            style[key] = val.getValue()
            delete outProps[key]
            continue
          }
          if (motionStyleProps[key]) {
            style[key] = val
            delete outProps[key]
            continue
          }
          if (motionExtraProps[key]) {
            if (key === 'animate' && inProps.animate === true) {
              continue
            }
            outProps[key] = val
          }
        }

        if (inProps.style) {
          Object.assign(style, inProps.style)
        }

        outProps.className = finalClassName
        style['will-change'] = 'transform'
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

View.staticStyleConfig = {
  ...View.staticStyleConfig,
  deoptProps: ['animate', 'drag', 'layoutTransition'],
}

export type MarginProps = {
  margin?: Sizes | SizesObject | GlossPropertySet['margin']
}

export function getMargin(props: MarginProps) {
  if (props.margin) {
    return { margin: getSizableValue(props.margin) }
  }
}
