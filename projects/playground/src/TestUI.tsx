import { Button, CardSimple, Col, Row, View } from '@o/ui'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import _ from 'lodash'
import * as React from 'react'

export function TestUI() {
  return (
    <Row overflow="hidden" height="100%">
      {/* <TestUIPopovers /> */}
      {/* <TestUIGlossSpeed /> */}
      {/* <TestUIEditor /> */}
      <TestUIMotion />
    </Row>
  )
}

export function TestUIMotion() {
  const ref = React.useRef(null)
  const scrollXProgress = useScrollProgress({
    ref,
  })

  return (
    <motion.div
      ref={ref}
      style={{
        display: 'flex',
        flex: 1,
        flexFlow: 'row',
        perspective: '1000px',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        scrollSnapPointsX: 'repeat(100%)',
      }}
    >
      {[0, 1, 2, 3, 4, 5].map(i => (
        <Card key={i} index={i} total={5} scrollXProgress={scrollXProgress} />
      ))}
    </motion.div>
  )
  // return (
  //   <Row
  //     flex={1}
  //     scrollable="x"
  //     perspective="1000px"
  //     scrollSnapType="x mandatory"
  //     scrollSnapPointsX="repeat(100%)"
  //   >
  //     {[0, 1, 2, 3, 4, 5].map(i => (
  //       <Card key={i} index={i} total={5} scrollXProgress={scrollXProgress} />
  //     ))}
  //   </Row>
  // )
}

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
