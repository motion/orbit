import { AppDefinition, AppIcon, ensure, react, Templates, useAppDefinition, useReaction, useStore } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, FullScreen, Geometry, Row, SimpleText, useIntersectionObserver, useNodeSize, useParentNodeSize, useTheme, View } from '@o/ui'
import { useMotionValue, useSpring } from 'framer-motion'
import React, { memo, useEffect, useLayoutEffect, useRef } from 'react'

import { useOm } from '../../om/om'
import { OrbitApp, whenIdle } from './OrbitApp'
import { appsCarouselStore, stackMarginLessPct } from './OrbitAppsCarouselStore'
import { OrbitSearchResults } from './OrbitSearchResults'

// import { to, useSpring, useSprings } from 'react-spring'
export const OrbitAppsCarousel = memo(() => {
  const { state } = useOm()
  const rowRef = appsCarouselStore.rowRef
  const apps = state.apps.activeClientApps
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef })
  const rowSize = useParentNodeSize({ ref: rowRef })
  const scaleVal = useMotionValue(0)
  const scale = useSpring(scaleVal)

  // const [scrollSpring, setScrollSpring, stopScrollSpring] = useSpring(() => ({
  //   x: 0,
  //   onRest: appsCarouselStore.onFinishScroll,
  //   onStart: appsCarouselStore.onStartScroll,
  // }))

  // const [springs, setCarouselSprings] = useSprings(apps.length, i => ({
  //   ...appsCarouselStore.getSpring(i),
  //   config: { mass: 1, tension: 350, friction: 32 },
  //   onRest: appsCarouselStore.onFinishZoom,
  //   onStart: appsCarouselStore.onStartZoom,
  // }))

  const rowWidth = rowSize.width ? rowSize.width * (1 - stackMarginLessPct) : 0

  // useEffect(() => {
  //   if (rowWidth) {
  //     appsCarouselStore.setProps({
  //       apps,
  //       setCarouselSprings,
  //       setScrollSpring,
  //       rowWidth,
  //     })
  //   }
  // }, [apps, setScrollSpring, setCarouselSprings, rowWidth])

  /**
   * Use this to update state after animations finish
   */
  const hidden = useReaction(() => appsCarouselStore.hidden)
  const [scrollable, disableInteraction] = useReaction(
    () =>
      [
        appsCarouselStore.isScrolling || appsCarouselStore.zoomedIn ? false : 'x',
        appsCarouselStore.zoomedIn === false,
      ] as const,
    async (next, { when, sleep }) => {
      const zoomedIn = !next[1]
      scale.set(zoomedIn ? 1 : 0.6)
      await when(() => !appsCarouselStore.isAnimating)
      await sleep(50)
      return next
    },
    {
      defaultValue: [false, true],
      name: 'OrbitAppsCarousel.render',
    },
  )

  // useLayoutEffect(() => {
  //   rowRef.current!.scrollLeft = scrollSpring.x.getValue()
  // }, [scrollable])

  return (
    <View data-is="OrbitAppsCarousel" width="100%" height="100%">
      <FullScreen pointerEvents="none" zIndex={3}>
        <OrbitSearchResults />
      </FullScreen>
      <View
        width="100%"
        height="100%"
        nodeRef={frameRef}
        transition="all ease 200ms"
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
          // onWheel={() => {
          //   appsCarouselStore.onFinishScroll()
          //   stopScrollSpring()
          //   if (appsCarouselStore.state.zoomedOut) {
          //     appsCarouselStore.animateTo(rowRef.current!.scrollLeft / rowWidth)
          //   }
          //   appsCarouselStore.finishWheel()
          // }}
          position="relative"
          zIndex={1}
          perspective="1200px"
          scrollSnapType="x mandatory"
          scrollSnapPointsX="repeat(100%)"
          nodeRef={appsCarouselStore.setRowNode}
        >
          {apps.map((app, index) => (
            <OrbitAppCard
              key={app.id}
              index={index}
              app={app}
              disableInteraction={disableInteraction}
              identifier={app.identifier!}
              width={frameSize.width}
              height={frameSize.height}
              scale={scale}
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
  disableInteraction: boolean
  index: number
  app: AppBit
}

class AppCardStore {
  isIntersected = false
  shouldRender = false

  renderApp = react(
    () => [
      this.isIntersected,
      appsCarouselStore.isAnimating,
      appsCarouselStore.state.zoomedOut === false,
    ],
    async ([isIntersected, isAnimating, zoomedIn], { sleep }) => {
      ensure('not animating', !isAnimating)
      ensure('is intersected', isIntersected)
      if (!zoomedIn) {
        await whenIdle()
        await sleep(20)
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
  ({ app, identifier, index, disableInteraction, scale, ...cardProps }: OrbitAppCardProps) => {
    const definition = useAppDefinition(identifier)!
    const store = useStore(AppCardStore)
    const theme = useTheme()
    const isFocused = useReaction(
      () => index === appsCarouselStore.focusedIndex,
      {
        // delay: 40,
        name: `AppCard${index}.isFocused`,
      },
      [index],
    )
    const isFocusZoomed = useReaction(
      () => index === appsCarouselStore.focusedIndex && !appsCarouselStore.state.zoomedOut,
      {
        delay: 40,
        name: `AppCard${index}.isFocusZoomed`,
      },
      [index],
    )
    const cardRef = useRef(null)

    useIntersectionObserver({
      ref: cardRef,
      options: {
        threshold: 0.9,
      },
      onChange(x) {
        const isIntersecting = !!(x.length && x[0].isIntersecting)
        store.setIsIntersected(isIntersecting)
      },
    })

    const mouseDown = useRef(-1)

    const cardBoxShadow = [15, 30, 120, [0, 0, 0, theme.background.isDark() ? 0.5 : 0.25]]

    // wrapping with view lets the scale transform not affect the scroll, for some reason this was happening
    // i thought scale transform doesnt affect layout?
    return (
      <View
        pointerEvents={isFocused ? 'inherit' : 'none'}
        data-is="OrbitAppCard-Container"
        zIndex={1000 - index}
        scrollSnapAlign="center"
      >
        <Geometry key={index}>
          {geometry => (
            <View
              animate
              background="blue"
              rotateY={geometry
                .scrollIntersection()
                .transform(x => x - index + 0.35)
                .transform([0, 1], [-20, 20])
                .spring({ stiffness: 300, damping: 50 })}
              scale={scale}
              x="20%"
              transformOrigin="center center"
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
              position="relative"
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
                borderRadius={isFocusZoomed ? 0 : 20}
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
                  disableInteraction={disableInteraction}
                  identifier={definition.id}
                  appDef={definition}
                  shouldRenderApp={definition.id === 'setupApp' || store.shouldRender}
                />
              </Card>
            </View>
          )}
        </Geometry>
      </View>
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
