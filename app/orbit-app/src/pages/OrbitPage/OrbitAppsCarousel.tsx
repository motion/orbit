import { AppDefinition, AppIcon, ensure, react, Templates, useAppDefinition, useReaction, useStore } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, FullScreen, Geometry, Row, SimpleText, useIntersectionObserver, useNodeSize, useOnMount, useParentNodeSize, useScrollProgress, useTheme, View } from '@o/ui'
import { MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
  const x = useSpring(useTransform(zoomOut, x => (x === 1 ? '0%' : '20%')), {
    damping: 50,
    stiffness: 250,
  })

  useOnMount(() => {
    appsCarouselStore.start()

    // link to isAnimating, not as nice as react-spring atm onAnimationStart() didnt fire

    let tm
    const update = () => {
      clearTimeout(tm)
      appsCarouselStore.isAnimating = true
      tm = setTimeout(() => {
        appsCarouselStore.isAnimating = false
      }, 40)
    }

    x.onChange(update)
    scrollIn.onChange(update)
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
  const [scrollable, disableInteraction] = useReaction(
    () => [appsCarouselStore.zoomedIn ? false : 'x', appsCarouselStore.zoomedIn === false] as const,
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
              disableInteraction={disableInteraction}
              identifier={app.identifier!}
              width={frameSize.width}
              height={frameSize.height}
              zoomOut={zoomOut}
              scrollIn={scrollIn}
              x={x}
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
  zoomOut: MotionValue
  scrollIn: MotionValue
}

class AppCardStore {
  // @ts-ignore
  props: Pick<OrbitAppCardProps, 'index'>

  isIntersected = false
  shouldRender = false

  renderApp = react(
    () => [this.isIntersected, appsCarouselStore.state.zoomedOut === false],
    async ([isIntersected, zoomedIn], { sleep }) => {
      if (this.shouldRender) return
      ensure('is intersected', isIntersected)
      if (!zoomedIn) {
        await whenIdle()
        await sleep(20)
        await whenIdle()
      }
      this.shouldRender = true
    },
  )

  isFocusZoomed = react(
    () => this.props.index === appsCarouselStore.focusedIndex && !appsCarouselStore.state.zoomedOut,
    // TODO play with this
    {
      delay: 40,
    },
  )

  isFocused = react(
    () => this.props.index === appsCarouselStore.focusedIndex,
    // TODO play with this
    {
      delay: 40,
    },
  )

  setIsIntersected(val: boolean) {
    this.isIntersected = val
  }
}

const OrbitAppCard = memo(
  ({
    app,
    identifier,
    index,
    disableInteraction,
    zoomOut,
    scrollIn,
    x,
    ...cardProps
  }: OrbitAppCardProps) => {
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

    const scale = useSpring(
      useTransform(zoomOut, zoom => {
        if (zoom === 1) {
          return index === appsCarouselStore.focusedIndex ? 1 : 0.5
        }
        return 0.6
      }),
      { damping: 50, stiffness: 500 },
    )

    // wrapping with view lets the scale transform not affect the scroll, for some reason this was happening
    // i thought scale transform doesnt affect layout?
    const mouseDown = useRef(0)
    return (
      <Geometry>
        {(geometry, ref) => (
          <View
            nodeRef={ref}
            pointerEvents={store.isFocused ? 'inherit' : 'none'}
            data-is="OrbitAppCard-Container"
            zIndex={1000 - index}
            scrollSnapAlign="center"
            marginRight={`-${stackMarginLessPct * 100}%`}
          >
            <View
              animate
              rotateY={geometry
                .scrollIntersection()
                .transform([-1, 1], [-40, 30])
                .mergeTransform([zoomOut], (prev, zoomOut) => (zoomOut === 1 ? 0 : prev))
                .spring({ stiffness: 250, damping: 50 })}
              opacity={geometry
                .scrollIntersection()
                .transform([-1, 1], [3, 0])
                .transform(x => log(x, index))}
              scale={scale}
              x={x}
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
                  store.isFocusZoomed
                    ? !definition.viewConfig ||
                      definition.viewConfig.transparentBackground !== false
                      ? theme.appCardBackgroundTransparent
                      : theme.appCardBackground
                    : theme.backgroundStronger
                }
                borderRadius={store.isFocusZoomed ? 0 : 20}
                {...(store.isFocused
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
                  shouldRenderApp={store.shouldRender}
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

/**
 * TODO pending this we can replace:
 */
const toValue: <T>(v: MotionValue<T> | T) => T = v => (v instanceof MotionValue ? v.get() : v)
const isMotionValue = (c: any) => c instanceof MotionValue
function useRelative<T>(callback: (...values: T[]) => T, ...values: (MotionValue<T> | T)[]) {
  // Compute the motion values's value by running
  // current values of its related values through
  // the callback function
  const getComputedValue = useCallback(() => callback(...values.map(toValue)), [callback, values])

  // Create new motion value
  const value = useMotionValue(getComputedValue())

  // Update the motion value with the computed value
  const compute = useCallback(() => value.set(getComputedValue()), [])

  // Partition the values into motion values / non-motion values
  const [mvs, nmvs]: [MotionValue<T>[], T[]] = useMemo(
    () =>
      values.reduce(
        (acc, val) => {
          acc[isMotionValue(val) ? 0 : 1].push(val)
          return acc
        },
        [[] as any[], [] as any[]],
      ),
    [values],
  )

  // When motion values values
  // change, update listeners
  useEffect(() => {
    compute()
    const rs = mvs.map(v => v.onChange(compute))
    return () => rs.forEach(remove => remove())
  }, [mvs])

  // When non-motion values
  // change, compute a new value
  useEffect(compute, [nmvs])

  return value
}
