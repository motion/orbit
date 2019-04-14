import * as React from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'

export const FadeIn = ({
  from = null,
  to = null,
  children,
  style = null,
  ...rest
}: UseSpringProps<any>) => {
  const props = useSpring({
    ...rest,
    from: {
      opacity: 0,
      transform: `translate3d(0,-20px,0)`,
      ...from,
    },
    to: {
      opacity: 1,
      transform: `translate3d(0,0,0)`,
      ...to,
    },
  })

  return <animated.div style={{ ...style, ...props }}>{children}</animated.div>
}
