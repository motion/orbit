import { Button, Geometry, Stack, View } from '@o/ui'
import { useMotionValue, useSpring } from 'framer-motion'
import React from 'react'

export function TestUIMotion() {
  const rowRef = React.useRef(null)
  const val = useMotionValue(0)
  const spring = useSpring(val, { damping: 50, stiffness: 250 })
  const state = React.useRef({
    controlled: false,
    wheelTm: null,
    dragStart: 0,
  })
  const set = React.useCallback((next: number) => {
    rowRef.current.style.scrollSnapType = 'initial'
    state.current.controlled = true
    val.set(next)
  }, [])
  const setUncontrolled = React.useCallback(() => {
    state.current.controlled = false
    spring.stop()
    rowRef.current.style.scrollSnapType = 'x mandatory'
  }, [])
  const pctSquish = 0.6
  React.useEffect(() => {
    spring.onChange(val => {
      if (state.current.controlled) {
        rowRef.current.scrollLeft = val * (1 - pctSquish) * window.innerWidth
      }
    })
  }, [])
  return (
    <Stack>
      <Stack direction="horizontal" group>
        <Button onClick={() => set(1)}>1</Button>
        <Button onClick={() => set(2)}>2</Button>
        <Button onClick={() => set(3)}>3</Button>
        <Button onClick={() => set(4)}>4</Button>
        <Button onClick={() => set(5)}>5</Button>
      </Stack>

      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-2}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onWheel={e => {
          clearTimeout(state.current.wheelTm)
          const xDelta = e.deltaX
          const index =
            rowRef.current.scrollLeft / window.innerWidth + (xDelta / window.innerWidth) * 12
          set(index)
          state.current.wheelTm = setTimeout(() => {
            setUncontrolled()
          }, 50)
        }}
        onDrag={(_, pan) => {
          const xAmt = pan.offset.x
          const indexDiff = -xAmt / window.innerWidth
          const extraSpeed = indexDiff * 1.05
          const index = state.current.dragStart + indexDiff + extraSpeed
          set(index)
        }}
        onDragStart={() => {
          state.current.dragStart = rowRef.current.scrollLeft / window.innerWidth
        }}
        onAnimationComplete={() => {
          console.warn('done')
          setUncontrolled()
        }}
      />
      <Stack
        direction="horizontal"
        flex={1}
        position="relative"
        zIndex={1}
        perspective="1200px"
        scrollable="x"
        scrollSnapType="x mandatory"
        scrollSnapPointsX="repeat(100%)"
        nodeRef={rowRef}
        onWheel={setUncontrolled}
      >
        {[0, 1, 2, 3, 4, 5, 6].map(index => (
          <Geometry key={index}>
            {(geometry, ref) => (
              <View nodeRef={ref} scrollSnapAlign="center" marginRight={`${-pctSquish * 100}%`}>
                <View
                  width="100vw"
                  height="92vh"
                  background="green"
                  boxShadow="0 0 10px rgba(0,0,0,0.5)"
                  zIndex={geometry.scrollIntersection().transform(x => 1 - Math.abs(x))}
                  rotateY={geometry
                    .scrollIntersection()
                    .transform([-1, 1], [50, -50])
                    .spring({ stiffness: 500, damping: 10 })}
                  opacity={geometry.scrollIntersection().transform([-1, 1], [0, 2])}
                  transformOrigin="center center"
                  animate={{
                    scale: 0.7,
                  }}
                />
              </View>
            )}
          </Geometry>
        ))}
      </Stack>
    </Stack>
  )
}
