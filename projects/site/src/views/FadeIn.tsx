import { createContextualProps, useDebounce, useDebounceValue, useGet, useIntersectionObserver } from '@o/ui'
import React, { memo, useCallback, useRef, useState } from 'react'
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
  friction: 10,
}

export const FadeIn = memo(
  ({ delay, intersection, threshold, from, to, children, style, ...springProps }: FadeInProps) => {
    const { shown, ref } = useDebouncedIntersection({ delay, intersection, threshold })
    const springStyle = useSimpleFade({ shown, from, to, ...springProps })
    return (
      <animated.div ref={ref} style={{ ...style, ...springStyle }}>
        {children}
      </animated.div>
    )
  },
)

// @ts-ignore
FadeIn.defaultProps = {
  threshold: 0.25,
}

// const Fade = useFadePage(config)
//  <Fade.Div key="one"></Fade.Div>

const FadeContext = createContextualProps({ shown: false })

export const FadeChild = memo(
  ({
    from,
    to,
    children,
    style,
    delay,
    disable,
    ...springProps
  }: UseSpringProps<any> & { delay?: number; disable?: boolean }) => {
    const props = FadeContext.useProps()
    const shown = useDebounceValue(!disable && props.shown, delay)
    const springStyle = useSimpleFade({ shown, from, to, ...springProps })
    return <animated.div style={{ ...style, ...springStyle }}>{children}</animated.div>
  },
)

export const useFadePage = (props: FadeInProps = { delay: 0 }) => {
  const { ref, shown } = useDebouncedIntersection(props)
  const getShown = useGet(shown)
  return {
    ref,
    FadeProvide: useCallback((p: { children: any }) => {
      return <FadeContext.PassProps shown={getShown()} {...p} />
    }, []),
  }
}

export const useSimpleFade = ({ shown, from, to, ...rest }: UseSpringProps<any>) => {
  const fromConf = {
    opacity: 0,
    transform: `translate3d(0,-15px,0)`,
    ...from,
  }
  return useSpring({
    ...rest,
    from: fromConf,
    to: !shown
      ? fromConf
      : {
          opacity: 1,
          transform: `translate3d(0,0,0)`,
          ...to,
        },
    config,
  })
}

export const useDebouncedIntersection = (props: FadeInProps = { delay: 0 }) => {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  const setShownSlow = useDebounce(setShown, props.delay)
  const hasShown = useRef(false)

  useIntersectionObserver({
    ref,
    options: { threshold: props.threshold, rootMargin: props.intersection },
    onChange(entries) {
      // only run once
      if (hasShown.current) return

      const isOffscreen = !entries || entries[0].isIntersecting === false
      if (props.disable || isOffscreen) {
        setShownSlow(false)
      } else {
        hasShown.current = true
        setShownSlow(true)
      }
    },
  })

  return {
    ref,
    shown,
  }
}
