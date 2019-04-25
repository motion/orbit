import { createContextualProps, FullScreen, useDebounce, useDebounceValue, useGet, useIntersectionObserver } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { memo, useCallback, useRef, useState } from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'

export type FadeInProps = UseSpringProps<any> & {
  delay?: number
  intersection?: IntersectionObserverInit['rootMargin']
  threshold?: number
}

export const fadeUpProps = {
  from: { transform: `translate3d(0,10px,0)`, opacity: 0 },
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

const FadeContext = createContextualProps({ shown: undefined, off: false })

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
    const shown = !!useDebounceValue(!disable && props.shown, delay)
    const off = props.off
    const springStyle = useSimpleFade({ shown, from, to, ...springProps, off })
    return (
      <animated.div style={style ? { ...style, ...springStyle } : springStyle}>
        {children}
      </animated.div>
    )
  },
)

export type UseFadePageProps = FadeInProps & { off?: boolean }

export const useFadePage = ({
  delay = 0,
  threshold = 0.4,
  off,
  ...props
}: UseFadePageProps = {}) => {
  const { ref, shown } = useDebouncedIntersection({ delay, threshold, ...props })
  const getShown = useGet(selectDefined(props.shown, shown))
  const getOff = useGet(off)
  return {
    ref,
    FadeProvide: useCallback((p: { children: any }) => {
      return <FadeContext.PassProps shown={getShown()} off={getOff()} {...p} />
    }, []),
  }
}

export const FadeParent = memo(({ children, ...props }: UseFadePageProps & { children?: any }) => {
  const Fade = useFadePage(props)
  return (
    <Fade.FadeProvide>
      <FullScreen ref={Fade.ref}>{children}</FullScreen>
    </Fade.FadeProvide>
  )
})

export const useSimpleFade = ({
  off,
  shown,
  from = {
    opacity: 0,
    transform: `translate3d(0,-15px,0)`,
  },
  to = { opacity: 1, transform: `translate3d(0,0,0)` },
  ...rest
}: UseFadePageProps) => {
  return useSpring({
    ...rest,
    from: off ? to : from,
    to: shown || off ? to : from,
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
