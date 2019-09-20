import { createStoreContext } from '@o/kit'
import { MotionProps, useIntersectionObserver, View, ViewProps } from '@o/ui'
import React, { memo, useCallback, useRef, useState } from 'react'

export type FadeInProps = ViewProps & {
  delay?: number
  intersection?: IntersectionObserverInit['rootMargin']
  threshold?: number
  disable?: boolean
  shown?: boolean
}

export const transitions: { [key: string]: MotionProps['transition'] } = {
  slowStiff: {
    type: 'spring',
    damping: 18,
    stiffness: 50,
  },
  slow: {
    type: 'spring',
    damping: 12,
    stiffness: 50,
  },
  slowBouncy: {
    type: 'spring',
    damping: 10,
    stiffness: 40,
  },
  bouncy: {
    type: 'spring',
    damping: 5,
    stiffness: 75,
  },
  normal: {
    type: 'spring',
    damping: 12,
    stiffness: 60,
  },
  fast: {
    type: 'spring',
    damping: 15,
    stiffness: 180,
  },
  fastStatic: {
    duration: 90 / 1000,
  },
}

export const fadeAnimations = {
  down: {
    style: {
      opacity: 0,
      y: -30,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  },
  up: {
    style: {
      opacity: 0,
      y: 30,
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

const FadeStoreContext = createStoreContext(
  class FadeContextStore {
    props: {
      disable: boolean
    }
    shownInternal = false
    get shown() {
      return !this.props.disable && this.shownInternal
    }
    setShown() {
      this.shownInternal = true
    }
  },
)

export type FadeChildProps = ViewProps & {
  // granular delay, 300, 400, etc
  delay?: number
  // easier delay, 1, 2, 3
  delayIndex?: number
  disable?: boolean
  fullscreen?: boolean
  reverse?: boolean
}

const initialScreenWidth = window.innerWidth

export const FadeInView = memo(
  ({
    style = fadeAnimations.down.style,
    animate = fadeAnimations.down.animate,
    transition = transitions.normal,
    children,
    delay,
    delayIndex,
    disable,
    fullscreen,
    reverse,
    display,
    ...rest
  }: FadeChildProps) => {
    const fadeStore = FadeStoreContext.useStore()
    const shown = !disable && (fadeStore.shown !== null ? fadeStore.shown : false)

    style = {
      display: display || 'flex',
      flexDirection: 'column',
      ...style,
      ...(fullscreen && fullscreenStyle),
    }

    // disable animation
    if (disable && animate) {
      style = {
        ...style,
        ...(animate as any),
      }
    }

    if (reverse) {
      ;[style, animate] = [animate, style]
    }

    const finalTransition =
      initialScreenWidth < 480
        ? { duration: 0 }
        : {
            ...(transition as any),
            delay: delayIndex ? delayIndex / 4.5 : (delay || 1) / 1000,
          }

    return (
      <View
        data-is="FadeChild"
        style={style}
        animate={shown ? animate : undefined}
        transition={finalTransition}
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
  threshold = 0.3,
  off,
  ...props
}: UseFadePageProps = {}) => {
  const ref = useRef(null)
  const store = FadeStoreContext.useCreateStore({ disable: props.disable }, { react: false })
  useIntersectionObserver({
    ref,
    options: { threshold: threshold, rootMargin: props.intersection },
    onChange(entries) {
      // only run once
      if (store.shownInternal) return
      const next = entries && entries.some(x => x.isIntersecting)
      if (next) {
        store.setShown()
      }
    },
  })
  return {
    ref,
    FadeProvide: useCallback(({ children }) => {
      return <FadeStoreContext.ProvideStore value={store}>{children}</FadeStoreContext.ProvideStore>
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
