import { createStoreContext } from '@o/kit'
import { useDebounce, useDebounceValue, useGet, useIntersectionObserver, View, ViewProps } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { memo, useCallback, useRef, useState } from 'react'

import { useIsTiny } from '../hooks/useScreenSize'

export type FadeInProps = ViewProps & {
  delay?: number
  intersection?: IntersectionObserverInit['rootMargin']
  threshold?: number
  disable?: boolean
  shown?: boolean
}

export const transitions = {
  slowNotBouncy: {
    type: 'spring',
    damping: 13,
    stiffness: 80,
  },
  slowConfig: {
    type: 'spring',
    damping: 20,
    stiffness: 150,
  },
  normal: {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  },
  fast: {
    type: 'spring',
    damping: 8,
    stiffness: 120,
  },
  fastStatic: {
    duration: 30,
  },
}

export const fadeAnimations = {
  down: {
    style: {
      opacity: 0,
      y: -20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  up: {
    style: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  right: {
    style: {
      opacity: 0,
      x: 30,
      rotateX: -15,
      rotateY: 15,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      x: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    },
  },
  left: {
    style: {
      opacity: 0,
      txys: [-30, 15, -15, 0.9],
      x: -30,
      rotateX: 15,
      rotateY: -15,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      x: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    },
  },
}

const FadeContext = createStoreContext(
  class FadeContextStore {
    shown = undefined
    off = false
  },
)

type FadeChildProps = ViewProps & {
  delay?: number
  disable?: boolean
  fullscreen?: boolean
}

export const FadeChild = memo(
  ({
    style = fadeAnimations.down.style,
    animate = fadeAnimations.down.animate,
    transition = transitions.normal,
    children,
    delay,
    disable,
    fullscreen,
    ...rest
  }: FadeChildProps) => {
    const isTiny = useIsTiny()
    const fadeContext = FadeContext.useStore()
    const shown = !!useDebounceValue(
      !disable && !window['recentHMR'] && selectDefined(fadeContext.shown, true),
      delay,
    )
    const styleFin = {
      display: 'flex',
      flexFlow: 'column',
      ...style,
      ...(fullscreen && fullscreenStyle),
    }
    if (isTiny) {
      return (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            justifyContent: 'inherit',
            alignItems: 'inherit',
            ...style,
          }}
          {...rest}
        >
          {children}
        </div>
      )
    }
    return (
      <View
        data-is="FadeChild"
        style={styleFin}
        animate={shown ? animate : undefined}
        transition={transition}
        {...rest}
      >
        {children}
      </View>
    )
  },
)

const fullscreenStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export type UseFadePageProps = FadeInProps & { off?: boolean }

export const useFadePage = ({
  delay = 200,
  threshold = 0.1,
  off,
  ...props
}: UseFadePageProps = {}) => {
  const { ref, shown } = useDebouncedIntersection({ delay, threshold, ...props })
  const shownFinal = selectDefined(props.shown, shown)
  const getProps = useGet({ shown, off })
  return {
    ref,
    FadeProvide: useCallback(props => {
      return <FadeContext.Provider {...props} {...getProps()} />
    }, []),
  }
}

export const FadeParent = memo(({ children, ...props }: UseFadePageProps & { children?: any }) => {
  const Fade = useFadePage(props)
  return (
    <Fade.FadeProvide>
      <View nodeRef={Fade.ref}>{children}</View>
    </Fade.FadeProvide>
  )
})

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
      if (hasShown.current && shown) return

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
