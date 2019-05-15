import { Col, createContextualProps, useDebounce, useDebounceValue, useGet, useIntersectionObserver } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { animated, useSpring, UseSpringProps } from 'react-spring'

import { useIsTiny } from '../hooks/useScreenSize'

export type FadeInProps = UseSpringProps<any> & {
  delay?: number
  intersection?: IntersectionObserverInit['rootMargin']
  threshold?: number
}

export const fadeUpProps = {
  from: { transform: `translate3d(0,10px,0)`, opacity: 0 },
}

export const slowConfigLessBounce = {
  mass: 0.5,
  tension: 50,
  friction: 8,
}

export const slowConfig = {
  mass: 0.9,
  tension: 50,
  friction: 5,
}

export const defaultConfig = {
  mass: 1,
  tension: 50,
  friction: 8,
}

export const fastConfig = {
  mass: 0.3,
  tension: 40,
  friction: 3,
}

export const fastStatticConfig = {
  duration: 30,
}

const FadeContext = createContextualProps({ shown: undefined, off: false })

type FadeChildProps = UseSpringProps<any> & {
  delay?: number
  disable?: boolean
  willAnimateOnHover?: boolean
  fullscreen?: boolean
}

const fullscreenStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export const FadeChild = memo(
  ({
    from,
    to,
    children,
    style,
    delay,
    disable,
    willAnimateOnHover,
    fullscreen,
    ...springProps
  }: FadeChildProps) => {
    const isTiny = useIsTiny()
    const props = FadeContext.useProps()
    const shown = !!useDebounceValue(!disable && props.shown, delay)
    const off = selectDefined(springProps.off, props.off)
    const springStyle = useSimpleFade({ shown, from, to, ...springProps, off })
    const styleFin = {
      ...(typeof style === 'function' ? style(springStyle) : style),
      ...springStyle,
      ...(fullscreen && fullscreenStyle),
    }
    if (isTiny) {
      return <div style={typeof style !== 'function' ? style : null}>{children}</div>
    }
    return (
      <animated.div className={willAnimateOnHover ? `hover-will-transform` : null} style={styleFin}>
        {children}
      </animated.div>
    )
  },
)

export type UseFadePageProps = FadeInProps & { off?: boolean }

export const useFadePage = ({
  delay = 0,
  threshold = 0.2,
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
      <Col ref={Fade.ref}>{children}</Col>
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
  spring,
  ...rest
}: UseFadePageProps) => {
  const hasMounted = useRef(false)

  useEffect(() => {}, [])

  // disable animations on recent hmr
  const disable = hasMounted.current || window['recentHMR'] || off
  return useSpring(
    spring || {
      from: disable ? to : from,
      to: shown || disable ? to : from,
      config: defaultConfig,
      ...rest,
    },
  )
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

export const fadeRightProps = {
  from: {
    opacity: 0,
    txys: [30, -15, 15, 0.9],
  },
  to: {
    opacity: 1,
    txys: [0, 0, 0, 1],
  },
  style: spring => ({
    transform: spring.txys.interpolate(
      (t, x, y, s) =>
        `perspective(600px) translateX(${t}px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`,
    ),
  }),
}

export const fadeLeftProps = {
  from: {
    opacity: 0,
    txys: [-30, 15, -15, 0.9],
  },
  to: {
    opacity: 1,
    txys: [0, 0, 0, 1],
  },
  style: spring => ({
    transform: spring.txys.interpolate(
      (t, x, y, s) =>
        `perspective(600px) translateX(${t}px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`,
    ),
  }),
}
