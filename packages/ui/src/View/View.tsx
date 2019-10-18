import { css } from '@o/css'
import { motion } from 'framer-motion'
import { Flex, gloss } from 'gloss'

import { AnimationStore } from '../Geometry'
import { elevationTheme } from './elevation'
import { marginTheme } from './marginTheme'
import { motionExtraProps, motionStyleProps } from './motionStyleProps'
import { paddingTheme } from './PaddedView'
import { ViewPropsPlain } from './types'

const shouldRenderToMotion = (props: any) =>
  'animate' in props || 'drag' in props || 'layoutTransition' in props

export const View = gloss<ViewPropsPlain>(Flex, {
  display: 'flex',

  // we handle this with paddingTheme/marginTheme
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
}).theme(marginTheme, paddingTheme, elevationTheme)

View.staticStyleConfig = {
  ...View.staticStyleConfig,
  deoptProps: ['animate', 'drag', 'layoutTransition'],
}
