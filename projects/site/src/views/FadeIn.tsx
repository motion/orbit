import { useDebounce, useIntersectionObserver } from '@o/ui'
import React, { useRef, useState } from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'

export type FadeInProps = UseSpringProps<any> & {
  delay?: number
  intersection?: IntersectionObserverInit['rootMargin']
}

export const FadeIn = ({
  from = null,
  to = null,
  children,
  style = null,
  disabled,
  intersection,
  delay,
  ...rest
}: FadeInProps) => {
  const ref = useRef(null)
  const [cur, setCur] = useState(null)
  const setCurSlow = useDebounce(setCur, delay)
  const hasShown = useRef(false)

  useIntersectionObserver({
    ref,
    options: { threshold: 0.25, rootMargin: intersection },
    onChange(entries) {
      // only run once
      if (hasShown.current) return

      const isOffscreen = !entries || entries[0].isIntersecting === false
      if (disabled || isOffscreen) {
        setCurSlow(fromConf)
      } else {
        hasShown.current = true
        setCurSlow({
          opacity: 1,
          transform: `translate3d(0,0,0)`,
          ...to,
        })
      }
    },
  })

  const fromConf = {
    opacity: 0,
    transform: `translate3d(0,-30px,0)`,
    ...from,
  }
  const props = useSpring({
    ...rest,
    from: fromConf,
    to: cur,
    config: {
      mass: 1,
      tension: 32,
      friction: 8,
    },
  })

  return (
    <animated.div ref={ref} style={{ ...style, ...props }}>
      {children}
    </animated.div>
  )
}
