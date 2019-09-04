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

export function TestUIMotion() {
  return (
    <Row
      flex={1}
      perspective="1200px"
      scrollable="x"
      scrollSnapType="x mandatory"
      scrollSnapPointsX="repeat(100%)"
    >
      {[0, 1, 2, 3, 4, 5].map(index => (
        <Geometry key={index}>
          {geometry => (
            <View scrollSnapAlign="center">
              <View
                width="100vw"
                height="100vh"
                background="lightblue"
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
