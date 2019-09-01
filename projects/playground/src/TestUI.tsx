import { Button, CardSimple, Col, gloss, Row, usePosition, View } from '@o/ui'
import { motion, useMotionValue, useSpring, useTransform, useViewportScroll } from 'framer-motion'
import _ from 'lodash'
import * as React from 'react'

export function TestUI() {
  return (
    <>
      {/* <TestUIPopovers /> */}
      {/* <TestUIGlossSpeed /> */}
      {/* <TestUIEditor /> */}
      {/* <TestUIMotion /> */}
      <TestUIParallax />
    </>
  )
}

export function TestUIParallax() {
  const ref = React.useRef(null)
  const ref2 = React.useRef(null)
  const y = useParallaxLayer({ ref })
  const y2 = useParallaxLayer({ ref: ref2, offset: 1.5 })
  return (
    <>
      <Layer nodeRef={ref} height="100vh" background="orange">
        <motion.div
          style={{
            position: 'absolute',
            y,
            background: 'yellow',
            top: 0,
            left: 20,
            width: 100,
            height: 100,
          }}
        />
      </Layer>
      <Layer nodeRef={ref2} height="100vh" background="red">
        <motion.div
          style={{
            position: 'absolute',
            y: y2,
            background: 'yellow',
            top: 0,
            left: 20,
            width: 100,
            height: 100,
          }}
        />
      </Layer>
      <Layer height="100vh" background="lightgreen" />
    </>
  )
}

function useParallaxLayer({
  ref,
  offset = 0,
  speed = -1,
}: {
  ref: React.MutableRefObject<HTMLElement>
  offset?: number
  speed?: number
}) {
  const position = usePosition({ ref })
  const { scrollY } = useViewportScroll()
  const motionOffset = useTransform(
    scrollY,
    position ? [position.top, position.top + 1] : [0, -1],
    [0, -(1 + offset)],
    {
      clamp: false,
    },
  )
  const motionSpeed = useTransform(motionOffset, [0, -(1 + offset)], [0, speed], {
    clamp: false,
  })
  return motionSpeed
}

const Layer = gloss(View, { width: '100%', position: 'relative' })

export function TestUIMotion() {
  const ref = React.useRef(null)
  const scrollXProgress = useScrollProgress({
    ref,
  })

  return (
    <Row overflow="hidden" height="100%">
      <motion.div
        ref={ref}
        style={{
          display: 'flex',
          flex: 1,
          flexFlow: 'row',
          perspective: '1200px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollSnapPointsX: 'repeat(100%)',
        }}
      >
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Card key={i} index={i} total={5} scrollXProgress={scrollXProgress} />
          // <Card rotateY={ref => ref.geometry.intersectionWithFrame().transform([0, 1], [-10, 10])} />
        ))}
      </motion.div>
    </Row>
  )
}

// geometry.intersectionWithFrame().transform([0, 1], [-10, 10])
//   => Springy
//      UI kit uses it internally to convert it into:

function Card(props: any) {
  const ry1 = useTransform(props.scrollXProgress, x => {
    return x - props.index + 0.35
  })
  const ry = useTransform(ry1, [0, 1], [-10, 10])
  const rotateY = useSpring(ry, { stiffness: 400, damping: 90 })
  return (
    <View>
      <motion.div
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          background: 'lightgreen',
          rotateY,
          scrollSnapAlign: 'center',
          transformOrigin: 'center center',
        }}
        animate={{ scale: 0.7 }}
      />
    </View>
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

function useScrollProgress({ ref }) {
  const scrollXProgress = useMotionValue(0)

  React.useEffect(() => {
    function updateCallback(e) {
      scrollXProgress.set(e.target.scrollLeft / e.target.clientWidth)
    }
    ref.current.addEventListener('scroll', updateCallback, { passive: true })
  }, [])

  return scrollXProgress
}
