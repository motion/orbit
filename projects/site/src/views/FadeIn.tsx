import * as React from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'

export const FadeIn = ({
  from = null,
  to = null,
  children,
  style = null,
  disabled,
  ...rest
}: UseSpringProps<any>) => {
  const fromConf = {
    opacity: 0,
    transform: `translate3d(0,-40px,0)`,
    ...from,
  }
  const props = useSpring({
    ...rest,
    from: fromConf,
    to: disabled
      ? fromConf
      : {
          opacity: 1,
          transform: `translate3d(0,0,0)`,
          ...to,
        },
    config: {
      mass: 1,
      tension: 32,
      friction: 8,
    },
  })

  return <animated.div style={{ ...style, ...props }}>{children}</animated.div>
}
