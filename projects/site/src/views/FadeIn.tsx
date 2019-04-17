import { useDebounce, useIntersectionObserver } from '@o/ui'
import React, { memo, useRef, useState } from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'

export type FadeInProps = UseSpringProps<any> & {
  delay?: number
  intersection?: IntersectionObserverInit['rootMargin']
  threshold?: number
}

export const fadeUpProps = {
  from: { transform: `translate3d(0,10px,0)` },
}

const config = {
  mass: 1,
  tension: 40,
  friction: 8,
}

export const FadeIn = memo(({
  from = null,
  to = null,
  children,
  style = null,
  disabled,
  intersection,
  threshold = 0.25,
  delay,
  ...rest
}: FadeInProps) => {
  const ref = useRef(null)
  const [cur, setCur] = useState(null)
  const setCurSlow = useDebounce(setCur, delay)
  const hasShown = useRef(false)

  useIntersectionObserver({
    ref,
    options: { threshold, rootMargin: intersection },
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
    transform: `translate3d(0,-15px,0)`,
    ...from,
  }
  const props = useSpring({
    ...rest,
    from: fromConf,
    to: cur,
    config,
  })

  return (
    <animated.div ref={ref} style={{ ...style, ...props }}>
      {children}
    </animated.div>
  )
})
