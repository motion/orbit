import { Button, CardSimple, Col, Geometry, Parallax, Row, View } from '@o/ui'
import _ from 'lodash'
import * as React from 'react'

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

export function TestUIMotion() {
  // const ref = React.useRef(null)
  // const scrollXProgress = useScrollProgress({
  //   ref,
  // })
  return (
    <Row overflow="hidden" height="100%">
      <Row
        flex={1}
        perspective="1200px"
        scrollable="x"
        scrollSnapType="x mandatory"
        scrollSnapPointsX="repeat(100%)"
      >
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Card key={i} />
        ))}
      </Row>
    </Row>
  )
}

function Card() {
  // const ry1 = useTransform(props.scrollXProgress, x => {
  //   return x - props.index + 0.35
  // })
  // const ry = useTransform(ry1, [0, 1], [-10, 10])
  // const rotateY = useSpring(ry, { stiffness: 400, damping: 90 })
  return (
    <Geometry>
      {geometry => (
        <View scrollSnapAlign="center">
          <View
            width={window.innerWidth}
            height={window.innerHeight}
            background="lightgreen"
            rotateY={geometry
              .scrollIntersection()
              .transform(x => x + 0.35)
              .transform([0, 1], [-10, 10])
              .spring({ stiffness: 400, damping: 90 })}
            transformOrigin="center center"
            animate={{ scale: 0.7 }}
          />
        </View>
      )}
    </Geometry>
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
