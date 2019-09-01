import { Button, CardSimple, Col, Row } from '@o/ui'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import _ from 'lodash'
import * as React from 'react'

export function TestUI() {
  return (
    <Row overflow="hidden" height="100%" width={window.innerWidth * 10} perspective="1000px">
      {/* <TestUIPopovers /> */}
      {/* <TestUIGlossSpeed /> */}
      {/* <TestUIEditor /> */}
      <TestUIMotion />
    </Row>
  )
}

export function TestUIMotion() {
  const scrollXProgress = useMotionValue(0)

  React.useEffect(() => {
    function updateCallback() {
      scrollXProgress.set(window.pageXOffset / window.innerWidth)
    }
    window.addEventListener('scroll', updateCallback, { passive: true })
  }, [])

  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <Card key={i} index={i} total={5} scrollXProgress={scrollXProgress} />
      ))}
    </>
  )
}

function Card(props: any) {
  const cardPosition = props.index + 1 / props.total
  const ry = useTransform(props.scrollXProgress, x => {
    // console.log(x, cardPosition, cardPosition / (x + 1))
    return (cardPosition / (x + 1)) * 10
  })
  const rotateY = useSpring(ry, { stiffness: 400, damping: 90 })
  return (
    <motion.div
      style={{ width: window.innerWidth, height: window.innerHeight, background: 'green', rotateY }}
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
