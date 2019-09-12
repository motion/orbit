import { AppDefinition, AppIcon, ensure, react, Templates, UpdatePriority, useAppDefinition, useReaction, useStore } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, FullScreen, Geometry, Row, SimpleText, useIntersectionObserver, useNodeSize, useOnMount, useParentNodeSize, useScrollProgress, useTheme, View } from '@o/ui'
import { MotionValue, useMotionValue } from 'framer-motion'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'

import { useOm } from '../../om/om'
import { OrbitApp, whenIdle } from './OrbitApp'
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

export const OrbitAppsCarousel = memo(() => {
  const om = useOm()
  const rowRef = appsCarouselStore.rowRef
  const apps = om.state.apps.activeClientApps
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef })
  const rowSize = useParentNodeSize({ ref: rowRef })
  const rowWidth = rowSize.width ? rowSize.width * (1 - stackMarginLessPct) : 0

  const zoomOut = useMotionValue(1)
  const scrollIn = useScrollProgress({ ref: rowRef })

  useOnMount(() => {
    appsCarouselStore.start()
  })

  useEffect(() => {
    if (rowWidth) {
      appsCarouselStore.setProps({
        apps,
        rowWidth,
        zoomOut,
      })
    }
  }, [apps, rowWidth])

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

  // useLayoutEffect(() => {
  //   rowRef.current!.scrollLeft = scrollSpring.x.getValue()
  // }, [scrollable])

  console.warn('OrbitAppsCarousel.render()')

  return (
    <View data-is="OrbitAppsCarousel" width="100%" height="100%">
      <FullScreen pointerEvents="none" zIndex={3}>
        <OrbitSearchResults />
      </FullScreen>
      <View
        width="100%"
        height="100%"
        nodeRef={frameRef}
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
          {apps.map((app, index) => (
            <OrbitAppCard
              key={app.id}
              index={index}
              app={app}
              identifier={app.identifier!}
              width={frameSize.width}
              height={frameSize.height}
              zoomOut={zoomOut}
              scrollIn={scrollIn}
            />
          ))}
        </Row>
      </View>
    </View>
  )
})

/**
 * Handles visibility of the app as it moves in and out of viewport
 */

type OrbitAppCardProps = CardProps & {
  identifier: string
  index: number
  app: AppBit
  zoomOut: MotionValue
  scrollIn: MotionValue
}

class AppCardStore {
  // @ts-ignore
  props: Pick<OrbitAppCardProps, 'index'>

  isIntersected = false
  shouldRender = false

  renderApp = react(
    () => [
      this.isIntersected,
      appsCarouselStore.state.zoomedOut === false,
      appsCarouselStore.isAnimating,
    ],
    async ([isIntersected, zoomedIn, isAnimating], { sleep }) => {
      if (this.shouldRender) return
      ensure('is intersected', isIntersected)
      ensure('not animating', !isAnimating)
      if (!zoomedIn) {
        await whenIdle()
        await sleep(250)
        await whenIdle()
      }
      this.shouldRender = true
    },
  )

  setIsIntersected(val: boolean) {
    this.isIntersected = val
  }
}

const OrbitAppCard = memo(
  ({ app, identifier, index, zoomOut, scrollIn, ...cardProps }: OrbitAppCardProps) => {
    const definition = useAppDefinition(identifier)!
    const store = useStore(AppCardStore, { index })
    const theme = useTheme()
    const cardRef = useRef(null)

    useIntersectionObserver({
      ref: cardRef,
      options: {
        threshold: 1,
      },
      onChange(x) {
        const isIntersecting = !!(x.length && x[0].isIntersecting)
        store.setIsIntersected(isIntersecting)
      },
    })

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
    return (
      <Geometry>
        {(geometry, ref) => (
          <View
            nodeRef={ref}
            pointerEvents={isFocused ? 'inherit' : 'none'}
            data-is="OrbitAppCard-Container"
            scrollSnapAlign="center"
            marginRight={`-${stackMarginLessPct * 100}%`}
            width="100vw"
          >
            <View
              animate
              zIndex={geometry.scrollIntersection().transform(x => 1 - Math.abs(x))}
              rotateY={geometry
                .scrollIntersection()
                .transform([-1, 1], [15, -25])
                .transform(x => (x > -12 ? -12 : x))
                .mergeTransform([zoomOut], (prev, zoomOut) => (zoomOut === 1 ? prev : 0))
                .spring({ stiffness: 250, damping: 50 })}
              opacity={geometry
                .scrollIntersection()
                .mergeTransform([zoomOut], (prev, zoomOut) => {
                  return zoomOut === 1 ? prev : 1
                })
                .transform([-1, 1], [0, 2.5])}
              scale={geometry
                .scrollIntersection()
                .mergeTransform([zoomOut], (intersect, zoomOut) => {
                  if (zoomOut === 0) return index === appsCarouselStore.focusedIndex ? 1 : 0.5
                  if (intersect >= 0) return 0.6
                  return 0.6 //todo
                })
                .spring({ damping: 50, stiffness: 500 })}
              x={geometry
                .useTransform(zoomOut, x => {
                  if (x) {
                    return '20%'
                  }
                  const focused = appsCarouselStore.focusedIndex
                  if (index === focused) {
                    return '0%'
                  }
                  if (index > focused) {
                    return '50%'
                  }
                  return '-50%'
                })
                .spring({ damping: 50, stiffness: 250 })}
              {...index === 0 && {
                onUpdate: () => {
                  clearTimeout(tm.current)
                  appsCarouselStore.isAnimating = true
                  tm.current = setTimeout(() => {
                    appsCarouselStore.isAnimating = false
                  }, 45)
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
              <Row
                alignItems="center"
                justifyContent="center"
                space="sm"
                padding
                position="absolute"
                bottom={-40}
                left={0}
                right={0}
              >
                <SimpleText>{app.name}</SimpleText>
              </Row>
              <Card
                data-is="OrbitAppCard"
                nodeRef={cardRef}
                borderWidth={0}
                background={
                  isFocusZoomed
                    ? !definition.viewConfig ||
                      definition.viewConfig.transparentBackground !== false
                      ? theme.appCardBackgroundTransparent
                      : theme.appCardBackground
                    : theme.backgroundStronger
                }
                // borderRadius={isFocusZoomed ? 0 : 20}
                borderRadius={0}
                {...(isFocused
                  ? {
                      boxShadow: [
                        [0, 0, 0, 3, theme.alternates!.selected['background']],
                        cardBoxShadow,
                      ],
                    }
                  : {
                      boxShadow: [cardBoxShadow],
                    })}
                transition="background 300ms ease"
                {...cardProps}
              >
                <AppLoadingScreen definition={definition} app={app} visible={!store.shouldRender} />
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
  return (
    <Templates.Message
      title={props.app.name}
      icon={<AppIcon identifier={props.definition.id} colors={props.app.colors} />}
      opacity={props.visible ? 1 : 0}
      transform={{
        y: props.visible ? 0 : 50,
      }}
      transition="all ease 200ms"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
    />
  )
})
