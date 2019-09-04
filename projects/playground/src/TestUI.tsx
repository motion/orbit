import { Button, CardSimple, Col, Geometry, Parallax, Row, View } from '@o/ui'
import { useMotionValue, useSpring } from 'framer-motion'
import _ from 'lodash'
import * as React from 'react'
import { useGesture } from 'react-use-gesture'

export function TestUI() {
  return (
    <>
      {/* <TestUIPopovers /> */}
      {/* <TestUIGlossSpeed /> */}
      {/* <TestUIEditor /> */}
      <TestUIMotion />
      {/* <TestUIParallax /> */}
    </>
  )
}

export function TestUIMotion() {
  const rowRef = React.useRef(null)
  const val = useMotionValue(0)
  const spring = useSpring(val)
  const state = React.useRef({
    controlled: false,
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

  const bind = useGesture({
    onDragStart() {
      state.current.dragStart = rowRef.current.scrollLeft
    },
    onDrag(next) {
      console.log(state.current.dragStart, -next.delta[0] / window.innerWidth)
      // set( + -)
    },
    onDragEnd() {
      setUncontrolled()
    },
  })

  React.useEffect(() => {
    spring.onChange(val => {
      if (state.current.controlled) {
        rowRef.current.scrollLeft = val * window.innerWidth
      }
    })
  }, [])

  return (
    <Col>
      <Row group>
        <Button onClick={() => set(1)}>1</Button>
        <Button onClick={() => set(2)}>2</Button>
        <Button onClick={() => set(3)}>3</Button>
        <Button onClick={() => set(4)}>4</Button>
      </Row>
      <Row
        flex={1}
        perspective="1200px"
        scrollable="x"
        scrollSnapType="x mandatory"
        scrollSnapPointsX="repeat(100%)"
        onWheel={setUncontrolled}
        nodeRef={rowRef}
        {...bind()}
      >
        {[0, 1, 2, 3, 4, 5].map(index => (
          <Geometry key={index}>
            {geometry => (
              <View scrollSnapAlign="center">
                <View
                  width="100vw"
                  height="92vh"
                  background="red"
                  rotateY={geometry
                    .scrollIntersection()
                    .transform(x => x - index + 0.5)
                    .transform([0, 1], [-20, 20])
                    .spring({ stiffness: 300, damping: 50 })}
                  transformOrigin="center center"
                  animate={{ scale: 0.7 }}
                />
              </View>
            )}
          </Geometry>
        ))}
      </Row>
    </Col>
  )
}

export function TestUIParallax() {
  return (
    <>
      <Parallax.Container height="100vh" background="orange">
        <Parallax.View
          speed={0.5}
          offset={0.5}
          x={100}
          position="absolute"
          background="yellow"
          top={0}
          left={20}
          width={100}
          height={100}
        />
      </Parallax.Container>
      <Parallax.Container height="100vh" background="red">
        <Parallax.View
          position="absolute"
          background="yellow"
          top={0}
          left={20}
          width={100}
          height={100}
        />
      </Parallax.Container>
      <Parallax.Container height="100vh" background="lightgreen" />
    </>
  )
}

export function TestUIGlossSpeed() {
  const [key, setKey] = React.useState(0)
  return (
    <Col space>
      <Button onClick={() => setKey(key + 1)}>render</Button>
      <Col space>
        {_.fill(new Array(150), 0).map((_, index) => (
          <CardSimple key={index} title={`card ${index}`}>
            lorem ipsume sit amet
          </CardSimple>
        ))}
      </Col>
    </Col>
  )
}
