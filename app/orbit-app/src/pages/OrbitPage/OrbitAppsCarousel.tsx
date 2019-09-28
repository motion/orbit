import { AppDefinition, AppIcon, ensure, react, Templates, UpdatePriority, useAppDefinition, useReaction, useStore } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, FullScreen, Geometry, Row, sleep, useDebounce, useDeepEqualState, useNodeSize, useOnMount, useOnUnmount, useScrollableParent, useScrollProgress, useTheme, View } from '@o/ui'
import { MotionValue, useMotionValue } from 'framer-motion'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useOm } from '../../om/om'
import { useAppsDrawerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'
import { appsCarouselStore, stackMarginLessPct } from './OrbitAppsCarouselStore'
import { OrbitSearchResults } from './OrbitSearchResults'

const updateOnWheel = e => {
  if (!appsCarouselStore.state.zoomedOut) return
  if (!e.currentTarget) return
  const offset = e.currentTarget.scrollLeft / appsCarouselStore.props.rowWidth
  const index = Math.round(offset)
  if (index !== appsCarouselStore.focusedIndex) {
    appsCarouselStore.setFocused(index)
  }
}

const borderRadius = 15

export const OrbitAppsCarousel = memo(() => {
  const om = useOm()
  const rowRef = appsCarouselStore.rowRef
  const apps = om.state.apps.activeClientApps

  const zoomOut = useMotionValue(1)
  const scrollIn = useScrollProgress({ ref: rowRef, direction: 'x' })

  useOnMount(() => {
    appsCarouselStore.start()
  })

  useEffect(() => {
    appsCarouselStore.setProps({
      apps,
      zoomOut,
    })
  }, [apps])

  /**
   * Use this to update state after animations finish
   */
  const hidden = useReaction(() => appsCarouselStore.hidden)
  const scrollable = useReaction(
    () => (appsCarouselStore.zoomedIn ? false : 'x'),
    async (next, { when, sleep }) => {
      await sleep(20)
      await when(() => !appsCarouselStore.isAnimating)
      return next
    },
    {
      defaultValue: false,
      priority: UpdatePriority.Low,
      name: 'OrbitAppsCarousel.render',
    },
  )

  const frameRef = useRef<any>()
  const [frameSize, setFrameSize] = useDeepEqualState([0, 0])
  const setFrameSizeDebounce = useDebounce(setFrameSize, 300)

  useNodeSize({
    ref: frameRef,
    throttle: 100,
    onChange({ width, height }) {
      setFrameSizeDebounce([width, height])
      const rowWidth = Math.round(width ? width * (1 - stackMarginLessPct) : 0)
      appsCarouselStore.setProps({
        rowWidth,
      })
    },
  })

  // useLayoutEffect(() => {
  //   rowRef.current!.scrollLeft = scrollSpring.x.getValue()
  // }, [scrollable])

  console.warn('OrbitAppsCarousel.render()', apps.map(x => x.id))

  return (
    <OrbitAppsCarouselFrame>
      <FullScreen nodeRef={frameRef} pointerEvents="none" zIndex={3}>
        <OrbitSearchResults />
      </FullScreen>
      <View
        width="100%"
        height="100%"
        {...hidden && {
          pointerEvents: 'none',
          opacity: 0,
          transform: {
            rotateY: '20deg',
            scale: 0.9,
            x: 200,
          },
        }}
      >
        <Row
          data-is="OrbitAppsCarousel-Row"
          flex={1}
          alignItems="center"
          justifyContent="flex-start"
          scrollable={scrollable}
          overflow={scrollable ? undefined : 'hidden'}
          position="relative"
          zIndex={1}
          perspective="1200px"
          scrollSnapType="x mandatory"
          scrollSnapPointsX="repeat(100%)"
          nodeRef={appsCarouselStore.setRowNode}
          onWheel={updateOnWheel}
        >
          <GeometryScrollUpdater />
          {apps.map((app, index) => (
            <OrbitAppCard
              key={app.id}
              index={index}
              app={app}
              identifier={app.identifier!}
              zoomOut={zoomOut}
              scrollIn={scrollIn}
              frameWidth={frameSize[0]}
              frameHeight={frameSize[1]}
            />
          ))}
        </Row>
      </View>
    </OrbitAppsCarouselFrame>
  )
})

function GeometryScrollUpdater() {
  const scrollableParentStore = useScrollableParent()!
  window['scrollableParentStore'] = scrollableParentStore

  // bugfix: when we went uncontrolled we didnt finish the scroll progress...
  // TODO when integrating the scrollLeft into motion, geometry can maybe handle
  // this internally
  useReaction(
    () => appsCarouselStore.controlled,
    async controlled => {
      if (!controlled) {
        scrollableParentStore.setScrollOffset(appsCarouselStore.state.index)
      }
    },
  )

  return null
}

const OrbitAppsCarouselFrame = props => {
  const { isOpen } = useAppsDrawerStore()
  return (
    <View
      data-is="OrbitAppsCarousel"
      width="100%"
      height="100%"
      transition="opacity ease 300ms"
      opacity={isOpen ? 0.25 : 1}
      {...props}
    />
  )
}

/**
 * Handles visibility of the app as it moves in and out of viewport
 */

type OrbitAppCardProps = CardProps & {
  identifier: string
  index: number
  app: AppBit
  zoomOut: MotionValue
  scrollIn: MotionValue
  frameWidth: number
  frameHeight: number
}

class AppCardStore {
  // @ts-ignore
  props: Pick<OrbitAppCardProps, 'index'>

  shouldRender = react(
    () => [
      appsCarouselStore.focusedIndex === this.props.index,
      appsCarouselStore.state.zoomedOut === false,
      appsCarouselStore.isAnimating,
    ],
    async ([isFocused, zoomedIn, isAnimating], { getValue }) => {
      if (getValue()) return
      ensure('isFocused', isFocused)
      await sleep(50)
      ensure('not animating', !isAnimating)
      if (!zoomedIn) {
        await sleep(800)
      }
      return zoomedIn
    },
  )
}

const OrbitAppCard = memo(
  ({
    app,
    identifier,
    index,
    zoomOut,
    scrollIn,
    frameWidth,
    frameHeight,
    ...cardProps
  }: OrbitAppCardProps) => {
    const definition = useAppDefinition(identifier)!
    const store = useStore(AppCardStore, { index })
    const theme = useTheme()
    const cardRef = useRef(null)

    const cardBoxShadow = [15, 30, 120, [0, 0, 0, theme.background.isDark() ? 0.5 : 0.25]]

    // group these updates together, and ensure they are low priority
    const [isFocused, isFocusZoomed] = useReaction(
      () => [
        index === appsCarouselStore.focusedIndex,
        index === appsCarouselStore.focusedIndex && !appsCarouselStore.state.zoomedOut,
      ],
      {
        priority: UpdatePriority.Low,
      },
      [index],
    )

    // wrapping with view lets the scale transform not affect the scroll, for some reason this was happening
    // i thought scale transform doesnt affect layout?
    const mouseDown = useRef(0)
    const tm = useRef<any>(0)

    if (!frameWidth || !frameHeight) {
      return null
    }

    /**
     * ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️
     *
     *    NOTE: DO NOT USE "calculated" widths anywhere on these outer views.
     *    That includes width="100%" or width="calc(...)"
     *    They slow down performance a *lot*!
     *
     * ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️ ☢️
     */
    return (
      <Geometry>
        {(geometry, ref) => (
          <View
            nodeRef={ref}
            pointerEvents={isFocused ? 'inherit' : 'none'}
            data-is="OrbitAppCard-Container"
            scrollSnapAlign="center"
            marginRight={`-${stackMarginLessPct * 100}%`}
            width={frameWidth}
            height={frameHeight}
            position="relative"
          >
            <View
              width={frameWidth}
              height={frameHeight + borderRadius}
              animate
              zIndex={geometry.scrollIntersection().transform(x => 1 - Math.abs(x))}
              y={geometry
                .useTransform(zoomOut, out => {
                  return out ? 0 : -borderRadius
                })
                .spring({ damping: 50, stiffness: 500 })}
              rotateY={geometry
                .scrollIntersection()
                .transform([-1, 1], [12, -28])
                .transform(x => (x > -4 ? -4 : x))
                .mergeTransform([zoomOut], (prev, zoomOut) => {
                  return zoomOut === 1 ? prev : 0
                })
                .spring({ stiffness: 250, damping: 50 })}
              opacity={geometry
                .scrollIntersection()
                .mergeTransform([zoomOut], (prev, zoomOut) => {
                  if (zoomOut) return prev
                  if (index === appsCarouselStore.focusedIndex) return 1
                  return -2
                })
                .transform([-1, 1], [0, 2.5])}
              scale={geometry
                .scrollIntersection()
                .mergeTransform([zoomOut], (intersect, zoomOut) => {
                  if (zoomOut === 0) return index === appsCarouselStore.focusedIndex ? 1 : 0.5
                  if (intersect >= -0) return 0.6
                  return 0.6
                  // todo - need to add a new thing to geometry, something like:
                  // .transformIf(x => x < 0.6, [0, 1], [10, 20])
                  // return Math.min(Math.max(0.5, 1 - intersect * -0.8), 0.6) //todo
                })
                // .transform([0.25, 0.6], [0.45, 0.6])
                .spring({ damping: 50, stiffness: 500 })}
              x={geometry
                .useTransform(zoomOut, x => {
                  if (x) {
                    return '20%'
                  }
                  const focused = appsCarouselStore.focusedIndex
                  if (index === focused) {
                    return `0%`
                  }
                  if (index > focused) {
                    return '100%'
                  }
                  return '-100%'
                })
                .spring({ damping: 50, stiffness: 250 })}
              {...index === 0 && {
                onUpdate: () => {
                  clearTimeout(tm.current)
                  appsCarouselStore.isAnimating = true
                  tm.current = setTimeout(() => {
                    appsCarouselStore.isAnimating = false
                  }, 75)
                },
              }}
              transformOrigin="center center"
              position="relative"
              onMouseDown={() => {
                if (appsCarouselStore.zoomedIn) {
                  return
                }
                mouseDown.current = Date.now()
              }}
              onMouseUp={e => {
                if (appsCarouselStore.zoomedIn) {
                  return
                }
                if (mouseDown.current > appsCarouselStore.lastDragAt) {
                  e.stopPropagation()
                  appsCarouselStore.scrollToIndex(index, true)
                }
                mouseDown.current = -1
              }}
            >
              <AppLoadingScreen definition={definition} app={app} visible={!store.shouldRender} />
              <Card
                data-is="OrbitAppCard"
                nodeRef={cardRef}
                borderWidth={0}
                paddingTop={borderRadius}
                scrollable
                height="100%"
                background={
                  isFocusZoomed
                    ? !definition.viewConfig ||
                      definition.viewConfig.transparentBackground !== false
                      ? theme.appCardBackgroundTransparent
                      : theme.appCardBackground
                    : theme.backgroundStronger
                }
                borderRadius={borderRadius}
                {...(isFocused
                  ? {
                      boxShadow: [[0, 0, 0, 3, theme.coats!.selected['background']], cardBoxShadow],
                    }
                  : {
                      boxShadow: [cardBoxShadow],
                    })}
                // some delay so it happens at "end/beginning"
                // makes it so it occludes cards behind them better if transparent
                transition={
                  isFocusZoomed ? 'background 200ms ease 150ms' : 'background 200ms ease 0ms'
                }
                // adjust for our top border
                innerColProps={{
                  transition: 'all ease 200ms',
                  transform: {
                    y: isFocusZoomed ? 0 : -borderRadius * 0.75,
                  },
                }}
                {...cardProps}
              >
                <OrbitApp
                  id={app.id!}
                  identifier={definition.id}
                  appDef={definition}
                  shouldRenderApp={store.shouldRender}
                  disableInteraction={!isFocusZoomed}
                />
              </Card>
            </View>
          </View>
        )}
      </Geometry>
    )
  },
)

type AppLoadingScreenProps = {
  visible: boolean
  app: AppBit
  definition: AppDefinition
}

const AppLoadingScreen = memo((props: AppLoadingScreenProps) => {
  useOnUnmount(() => {
    console.warn('unmounting inner geometry')
  })
  return (
    <Templates.Message
      pointerEvents="none"
      className="app-loading-screen"
      title={props.app.name}
      icon={<AppIcon identifier={props.definition.id} colors={props.app.colors} />}
      opacity={props.visible ? 1 : 0}
      transform={{
        y: props.visible ? 0 : 50,
        z: 0,
      }}
      transition="all ease 200ms"
      zIndex={1}
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
    />
  )
})
