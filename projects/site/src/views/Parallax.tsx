import { withAnimated } from '@react-spring/animated'
import { config as configs, Controller, SpringConfig } from '@react-spring/core'
import { useOnce } from '@react-spring/shared'
import { defaultElement as View, requestAnimationFrame } from '@react-spring/shared/globals'
import React, { CSSProperties, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { useMemoOne } from 'use-memo-one'

const AnimatedView = withAnimated(View)
const ParentContext = React.createContext<any>(null)

function getScrollType(horizontal: boolean) {
  return horizontal ? 'scrollLeft' : 'scrollTop'
}

const START_TRANSLATE_3D = 'translate3d(0px,0px,0px)'
const START_TRANSLATE = 'translate(0px,0px)'

interface IParallaxLayer {
  setHeight(height: number, immediate?: boolean): void
  setPosition(height: number, scrollTop: number, immediate?: boolean): void
}

interface IParallax {
  config: ConfigProp
  busy: boolean
  space: number
  offset: number
  current: number
  controller: Controller<{ scroll: number }>
  layers: Set<IParallaxLayer>
  scrollTo(offset: number): void
  update(): void
  stop(): void
}

type ViewProps = React.ComponentPropsWithoutRef<'div'>

interface ParallaxLayerProps extends ViewProps {
  horizontal?: boolean
  /** Size of a page, (1=100%, 1.5=1 and 1/2, ...) */
  factor?: number
  /** Determines where the layer will be at when scrolled to (0=start, 1=1st page, ...) */
  offset?: number
  /** Shifts the layer in accordance to its offset, values can be positive or negative */
  speed?: number
}

export const ParallaxLayer = React.memo(
  ({ horizontal, factor = 1, offset = 0, speed = 0, ...rest }: ParallaxLayerProps) => {
    // Our parent controls our height and position.
    const parent = useContext<IParallax>(ParentContext)

    // This is how we animate.
    const ctrl = useMemoOne(() => {
      const targetScroll = Math.floor(offset) * parent.space
      const distance = parent.space * offset + targetScroll * speed
      return new Controller({
        space: parent.space * factor,
        translate: -(parent.current * speed) + distance,
      })
    }, [])

    // Create the layer.
    const layer = useMemoOne<IParallaxLayer>(
      () => ({
        setPosition(height, scrollTop, immediate = false) {
          const targetScroll = Math.floor(offset) * height
          const distance = height * offset + targetScroll * speed
          ctrl.start()
          ctrl.update({
            translate: -(scrollTop * speed) + distance,
            config: parent.config,
            immediate,
          })
        },
        setHeight(height, immediate = false) {
          ctrl.start()
          ctrl.update({
            space: height * factor,
            config: parent.config,
            immediate,
          })
        },
      }),
      [],
    )

    // Register the layer with our parent.
    useOnce(() => {
      if (parent) {
        parent.layers.add(layer)
        parent.update()
        return () => {
          parent.layers.delete(layer)
          parent.update()
        }
      }
    })

    const translate3d = ctrl.animated.translate.interpolate(
      horizontal ? x => `translate3d(${x}px,0,0)` : y => `translate3d(0,${y}px,0)`,
    )

    return (
      <AnimatedView
        {...rest}
        style={{
          position: 'absolute',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
          [horizontal ? 'height' : 'width']: '100%',
          [horizontal ? 'width' : 'height']: ctrl.animated.space,
          WebkitTransform: translate3d,
          MsTransform: translate3d,
          transform: translate3d,
          ...rest.style,
        }}
      />
    )
  },
)

type ConfigProp = SpringConfig | ((key: string) => SpringConfig)

interface ParallaxProps extends ViewProps {
  /** Determines the total space of the inner content where each page takes 100% of the visible container */
  pages: number
  config?: ConfigProp
  enabled?: boolean
  horizontal?: boolean
  innerStyle?: CSSProperties
  scrollingElement?: HTMLElement
  showAbsolute?: boolean
  container?: any
  pageHeight?: number
  disable?: boolean
}

export const Parallax = React.memo(
  React.forwardRef<IParallax, ParallaxProps>(
    (
      {
        pages,
        config = configs.slow,
        enabled = true,
        horizontal = false,
        innerStyle,
        scrollingElement,
        showAbsolute,
        container,
        pageHeight,
        disable,
        ...rest
      },
      ref,
    ): any => {
      const [ready, setReady] = useState(false)

      let state: IParallax
      state = useMemoOne(
        () => ({
          config,
          busy: false,
          space: 0,
          current: 0,
          offset: 0,
          controller: new Controller({ scroll: 0 }),
          layers: new Set<IParallaxLayer>(),
          update: () => update(),
          scrollTo: offset => scrollTo(offset),
          stop: () => state.controller.stop(),
        }),
        [],
      )

      useImperativeHandle(ref, () => state, [])

      useEffect(() => {
        state.config = config
      }, [config])

      const containerRef = useRef<any>()
      const contentRef = useRef<any>()

      useLayoutEffect(() => {
        if (pageHeight) {
          state.space = pageHeight
        }
      }, [pageHeight])

      useLayoutEffect(() => {
        if (container) {
          containerRef.current = container
        }
      }, [container])

      useLayoutEffect(() => {
        if (scrollingElement) {
          const onScroll = () => {
            if (!state.busy) {
              state.busy = true
              state.current = containerRef.current[getScrollType(horizontal)]
              requestAnimationFrame(() => {
                state.layers.forEach(layer => layer.setPosition(state.space, state.current))
                state.busy = false
              })
            }
          }

          scrollingElement.addEventListener('scroll', onScroll, { passive: true })
          return () => {
            scrollingElement.removeEventListener('scroll', onScroll)
          }
        }
      }, [scrollingElement])

      const update = () => {
        const container = containerRef.current
        if (!container) return

        const scrollType = getScrollType(horizontal)
        if (enabled) {
          state.current = container[scrollType]
        } else {
          container[scrollType] = state.current = state.offset * state.space
        }

        const content = contentRef.current
        if (content) {
          const sizeProp = horizontal ? 'width' : 'height'
          content.style[sizeProp] = `${state.space * pages}px`
        }

        state.layers.forEach(layer => {
          layer.setHeight(state.space, true)
          layer.setPosition(state.space, state.current, true)
        })
      }

      const scrollTo = (offset: number) => {
        const container = containerRef.current
        const scrollType = getScrollType(horizontal)
        state.offset = offset
        state.controller.stop()
        const scroll = offset * state.space
        state.controller.update({
          scroll,
          config,
          onFrame({ scroll }) {
            container[scrollType] = scroll
          },
        })
      }

      useEffect(() => state.update())

      useOnce(() => {
        setReady(true)

        const onResize = () => {
          const update = () => state.update()
          requestAnimationFrame(update)
          setTimeout(update, 150) // Some browsers don't fire on maximize!
        }

        window.addEventListener('resize', onResize, false)
        return () => window.removeEventListener('resize', onResize, false)
      })

      if (disable) {
        return rest.children
      }

      return (
        <>
          <View
            {...rest}
            // ref={containerRef}
            onWheel={enabled ? state.stop : null}
            onTouchStart={enabled ? state.stop : null}
            style={{
              WebkitOverflowScrolling: 'touch',
              WebkitTransform: START_TRANSLATE,
              MsTransform: START_TRANSLATE,
              transform: START_TRANSLATE_3D,
              ...rest.style,
            }}
          >
            {ready && (
              <View
                ref={contentRef}
                style={{
                  [horizontal ? 'height' : 'width']: '100%',
                  position: 'absolute',
                  overflow: 'hidden',
                  [horizontal ? 'width' : 'height']: state.space * pages,
                  WebkitTransform: START_TRANSLATE,
                  MsTransform: START_TRANSLATE,
                  transform: START_TRANSLATE_3D,
                  ...innerStyle,
                }}
              >
                <ParentContext.Provider value={state}>{rest.children}</ParentContext.Provider>
              </View>
            )}
          </View>
          {!showAbsolute && <div style={{ height: state.space * pages }} />}
        </>
      )
    },
  ),
)
