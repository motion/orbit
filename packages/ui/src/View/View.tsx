import { css, GlossPropertySet } from '@o/css'
import { motion } from 'framer-motion'
import { Base, gloss, ThemeFn } from 'gloss'

import { AnimationStore } from '../Geometry'
import { Sizes } from '../Space'
import { elevationTheme } from './elevation'
import { getSizableValue } from './getSizableValue'
import { motionExtraProps, motionStyleProps } from './motionStyleProps'
import { paddingTheme } from './PaddedView'
import { SizesObject, ViewPropsPlain } from './types'

// includes motion styles too
export const motionProps = {
  ...motionStyleProps,
  ...motionExtraProps,
}

const shouldRenderToMotion = (props: any) =>
  'animate' in props || 'drag' in props || 'layoutTransition' in props

export type MarginProps = {
  margin?: Sizes | SizesObject | GlossPropertySet['margin']
}

export const getMargin: ThemeFn<MarginProps> = props => {
  if (props.margin && props.margin !== 0) {
    return { margin: getSizableValue(props.margin) }
  }
}

// regular view
export const View = gloss<ViewPropsPlain>(Base, {
  display: 'flex',

  // we handle this with usePadding/getMargin
  ignorePropsToStyle: {
    padding: true,
    margin: true,
  },

  config: {
    // shouldAvoidProcessingStyles: shouldRenderToMotion,
    postProcessProps(inProps, outProps, getStyles) {
      if (shouldRenderToMotion(inProps)) {
        let style = css(getStyles(), { snakeCase: false })

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

        // outProps.className = finalClassName
        style['willChange'] = 'transform'
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
  },
}).theme(getMargin, paddingTheme, elevationTheme)

View.staticStyleConfig = {
  ...View.staticStyleConfig,
  deoptProps: ['animate', 'drag', 'layoutTransition'],
}
