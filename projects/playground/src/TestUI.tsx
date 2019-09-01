import { Button, CardSimple, Col, numberBounder, Row } from '@o/ui'
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
  const scrollXProgress = useScrollProgress()

  return (
    <Row
      flex={1}
      scrollable="x"
      perspective="1000px"
      scrollSnapType="x mandatory"
      scrollSnapPointsX="repeat(100%)"
    >
      {[0, 1, 2, 3, 4, 5].map(i => (
        <Card key={i} index={i} total={5} scrollXProgress={scrollXProgress} />
      ))}
    </Row>
  )
}

const bound = numberBounder(-0.5, 0.5)

function Card(props: any) {
  const ry1 = useTransform(props.scrollXProgress, x => {
    const cur = x + 0.45
    const offset = bound(cur - props.index)
    console.log(props.index, offset)
    if (props.index === 1) {
      // console.log({ cur, props.index, offset }, cur / cardPosition)
    }
    return offset
  })
  const ry = useTransform(ry1, [0, 1], [-10, 10])
  const rotateY = useSpring(ry, { stiffness: 400, damping: 90 })
  return (
    <motion.div
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'green',
        rotateY,
        scrollSnapAlign: 'start',
      }}
      animate={{ scale: 0.7 }}
    />
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

function useScrollProgress() {
  const scrollXProgress = useMotionValue(0)

  React.useEffect(() => {
    function updateCallback() {
      scrollXProgress.set(window.pageXOffset / window.innerWidth)
    }
    window.addEventListener('scroll', updateCallback, { passive: true })
  }, [])

  return scrollXProgress
}
