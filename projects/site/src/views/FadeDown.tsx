import * as React from 'react'
import { animated, Spring } from 'react-spring/renderprops'

export const FadeDown = ({ disable = false, from = null, to = null, children, ...rest }) => {
  const fromConf = {
    ...from,
    opacity: 0,
    transform: `translate3d(0,-20px,0)`,
  }
  const toConf = {
    ...to,
    opacity: 1,
    transform: `translate3d(0,0,0)`,
  }

  return (
    <Spring from={fromConf} to={disable ? fromConf : toConf} {...rest}>
      {props => <animated.div style={props}>{children}</animated.div>}
    </Spring>
  )
}
