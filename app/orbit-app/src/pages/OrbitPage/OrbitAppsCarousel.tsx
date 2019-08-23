import { AppDefinition, AppIcon, ensure, react, Templates, useAppDefinition, useReaction, useStore } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, FullScreen, Row, SimpleText, useIntersectionObserver, useNodeSize, useParentNodeSize, useTheme, View } from '@o/ui'
import React, { memo, useEffect, useLayoutEffect, useRef } from 'react'
import { to, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import { useOm } from '../../om/om'
import { whenIdle } from './OrbitApp'
import { appsCarouselStore, stackMarginLessPct } from './OrbitAppsCarouselStore'
import { OrbitSearchResults } from './OrbitSearchResults'

export const OrbitAppsCarousel = memo(() => {
  const { state } = useOm()
  const rowRef = appsCarouselStore.rowRef
  const apps = state.apps.activeClientApps
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef })
  const rowSize = useParentNodeSize({ ref: rowRef })

  const [scrollSpring, setScrollSpring, stopScrollSpring] = useSpring(() => ({
    x: 0,
    onRest: appsCarouselStore.onFinishScroll,
    onStart: appsCarouselStore.onStartScroll,
  }))

  const [springs, setCarouselSprings] = useSprings(apps.length, i => ({
    ...appsCarouselStore.getSpring(i),
    config: { mass: 1, tension: 350, friction: 32 },
    onRest: appsCarouselStore.onFinishZoom,
    onStart: appsCarouselStore.onStartZoom,
  }))

  const rowWidth = rowSize.width ? rowSize.width * (1 - stackMarginLessPct) : 0

  useEffect(() => {
    if (rowWidth) {
      appsCarouselStore.setProps({
        apps,
        setCarouselSprings,
        setScrollSpring,
        rowWidth,
      })
    }
  }, [apps, setScrollSpring, setCarouselSprings, rowWidth])

  const bind = useGesture({
    onDrag: appsCarouselStore.onDrag,
  })

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
      await when(() => !appsCarouselStore.isAnimating)
      await sleep(50)
      return next
    },
    {
      defaultValue: [false, true],
      name: 'OrbitAppsCarousel.render',
    },
  )

  useLayoutEffect(() => {
    rowRef.current!.scrollLeft = scrollSpring.x.getValue()
  }, [scrollable])

  // comented out: was causing really crazy bugs
  // this is literally just to fix a stupid hmr bug where when on setupApp
  // you'd find it scrolled weirdly, i tried mutationObserver/addEventListener('scroll'),
  // neither pick it up because the event is removed
  // useEffect(() => {
  //   if (rowRef.current) {
  //     const curLeft = Math.round(rowRef.current.scrollLeft)
  //     const index = appsCarouselStore.focusedIndex
  //     const expectedLeft = Math.floor(index * rowWidth)
  //     if (curLeft !== expectedLeft) {
  //       appsCarouselStore.animateAndScrollTo(0)
  //       sleep(100).then(() => {
  //         appsCarouselStore.animateAndScrollTo(index)
  //       })
  //       console.warn('mismatched scroll spring / scrollLeft', curLeft, expectedLeft)
  //     }
  //   }
  // })

  return (
    <View data-is="OrbitAppsCarousel" width="100%" height="100%">
      <FullScreen pointerEvents="none" zIndex={3}>
        <OrbitSearchResults />
      </FullScreen>
      <View
        width="100%"
        height="100%"
        overflow="hidden"
        ref={frameRef}
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
          onWheel={() => {
            appsCarouselStore.onFinishScroll()
            stopScrollSpring()
            if (appsCarouselStore.state.zoomedOut) {
              appsCarouselStore.animateTo(rowRef.current!.scrollLeft / rowWidth)
            }
            appsCarouselStore.finishWheel()
          }}
          scrollLeft={scrollSpring.x}
          animated
          ref={appsCarouselStore.setRowNode}
          perspective="1000px"
          {...bind()}
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
              springs={springs}
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
  springs: any
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
        await sleep(150)
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
  ({ app, identifier, index, disableInteraction, springs, ...cardProps }: OrbitAppCardProps) => {
    const definition = useAppDefinition(identifier)!
    const store = useStore(AppCardStore)
    const spring = springs[index]
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
        marginRight={`-${stackMarginLessPct * 100}%`}
      >
        <View
          animated
          transform={to(
            Object.keys(spring).map(k => spring[k]),
            (x, y, scale, ry) => `translate3d(${x}%,${y}px,0) scale(${scale}) rotateY(${ry}deg)`,
          )}
          opacity={spring.opacity}
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
          {/* <AppIcon
            position="absolute"
            top={-10}
            left={-15}
            size={32}
            opacity={1}
            identifier={definition.id}
            colors={app.colors}
            opacity={appsCarouselStore.zoomedIn ? 0 : 1}
            pointerEvents="none"
          /> */}
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
            ref={cardRef}
            borderWidth={0}
            background={
              isFocusZoomed
                ? !definition.viewConfig || definition.viewConfig.transparentBackground !== false
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
            {store.shouldRender && (
              <iframe
                style={{ width: '100%', height: '100%' }}
                src={`http://localhost:3001/isolate/${app.identifier}/${app.id}`}
              />
            )}
          </Card>
        </View>
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
