import { Button, CardSimple, Col, Parallax, Title, View } from '@o/ui'
import _ from 'lodash'
import * as React from 'react'

export function TestUI() {
  return (
    <>
      {/* <TestMediaQueries /> */}
      {/* <TestUIPopovers /> */}
      {/* <TestUIGlossSpeed /> */}
      {/* <TestUIEditor /> */}
      {/* <TestUIMotion /> */}
      {/* <TestUIAnimation /> */}
      <TestUIParallax />
    </>
  )
}

export function TestMediaQueries() {
  return <View sm-background="red" background="green" width={100} height={100} />
}

const logPass = x => {
  console.log(x)
  return x
}

export function TestUIParallax() {
  console.log('render me')

  const views = index => (
    <>
      <Parallax.View
        offset={0}
        speed={1}
        align="center"
        x={100}
        position="absolute"
        background="linear-gradient(pink, black, red,pink, black, red,pink, black, red)"
        top={0}
        left={20}
        scale={1.5}
        width="50%"
        height="80%"
        alignItems="center"
        justifyContent="center"
      >
        <Title>helloooooo {index}</Title>
      </Parallax.View>
      <Parallax.View
        offset={0.75}
        speed={0.25}
        x={180}
        position="absolute"
        background="yellow"
        top={0}
        left={20}
        width={80}
        height={80}
        clamp
      >
        offset 0.75 speed 0.25 index {index}
      </Parallax.View>
      <Parallax.View
        offset={0}
        speed={0.25}
        // swing={2}
        // clamp={[-2, 2]}
        x={260}
        position="absolute"
        background="yellow"
        top={0}
        left={20}
        width={80}
        height={80}
      >
        offset 0 speed 0.25 index {index}
      </Parallax.View>
      <Parallax.View
        x={200}
        position="absolute"
        top="50%"
        left={20}
        key={4}
        parallax={geometry => {
          return {
            y: geometry
              .useParallaxIntersection({ speed: 3, offset: 0.5, clamp: [-1, 1.5] })
              .transform([-1, -0.4, 0, 1, 1.4, 1.5], [-1, -0.1, 0, 0.1, 0.2, 0.8])
              .transform(geometry.transforms.scrollParent),

            opacity: geometry
              .useParallaxIntersection({ speed: 3, offset: 0.5, clamp: [-1, 1.5] })
              .transform([-1, -0.4, 0, 1, 1.4, 1.5], [-1, 1, 1, 1, 1, 0.8]),
          }
        }}
      >
        <Title>Hello {index}</Title>
      </Parallax.View>
      <Parallax.View
        offset={0.5}
        speed={2}
        x={0}
        position="absolute"
        background="darkred"
        top={0}
        left={0}
        width={80}
        height={40}
        clamp={[-0.5, 1.5]}
      >
        offset 0.5 speed 2
      </Parallax.View>

      <Parallax.View
        position="absolute"
        background="red"
        top="calc(100% - 100px)"
        left={220}
        width={100}
        height={100}
        parallax={geometry => ({
          opacity: geometry
            .useParallaxIntersection({ speed: 1, offset: 0 })
            .transform([-1, 0.5, 0.5, 1], [0, 1, 1, -1]),
        })}
      >
        opacity in/out
      </Parallax.View>

      <Parallax.View
        speed={2}
        offset={0.5}
        position="absolute"
        background="blue"
        top="calc(100% - 100px)"
        left={320}
        width={100}
        height={100}
        parallax={geometry => ({
          opacity: geometry.useParallaxIntersection(),
        })}
      >
        opacity
      </Parallax.View>

      <Parallax.View
        speed={1}
        offset={0}
        position="absolute"
        background="blue"
        top="calc(100% - 100px)"
        left={420}
        width={100}
        height={100}
        parallax={geometry => ({
          opacity: geometry.useParallaxIntersection(),
        })}
      >
        offset 0 speed 1
      </Parallax.View>
      <Parallax.View
        position="absolute"
        bottom="0%"
        parallax={geometry => {
          return {
            y: geometry
              .useParallaxIntersection({
                speed: 1,
                relativeTo: 'frame',
              })
              .transform([-1, -0.2, 0, 0.2, 1], [-3, -0.05, 0, 0.05, 3])
              .transform([-1, -0.2, 0, 0.2, 1], [-3, -0.05, 0, 0.05, 3])
              .transform(x => x * 4),
          }
        }}
      >
        <Title color="yellow">Hello World</Title>
      </Parallax.View>
    </>
  )

  return (
    <>
      <Parallax.Container overflow="hidden" height="100vh" background="lightgreen">
        {views(0)}
      </Parallax.Container>
      <Parallax.Container overflow="hidden" height="100vh" background="indigo">
        <Col margin="auto" space="xl">
          <Parallax.View
            parallax={geometry => {
              return {
                y: geometry
                  .useParallaxIntersection({
                    speed: 1,
                    relativeTo: 'frame',
                  })
                  .transform([-1, -0.2, 0, 0.2, 1], [-3, -0.05, 0, 0.05, 3])
                  .transform([-1, -0.2, 0, 0.2, 1], [-3, -0.05, 0, 0.05, 3])
                  .transform(x => x * 500),
              }
            }}
          >
            <Title color="yellow">Hello World</Title>
          </Parallax.View>
          <Parallax.View
            height={400}
            width={400}
            background="black"
            parallax={geometry => {
              return {
                y: geometry
                  .useParallaxIntersection({
                    speed: 0.25,
                    relativeTo: 'node',
                    clamp: [-2, 1],
                  })
                  .transform([0, 0.2, 0.21, 0.79, 0.8, 1], [-2, 0.2, 0.21, 0.79, 0.8, 3])
                  .transform(x => x * 20),
                opacity: geometry
                  .useParallaxIntersection({
                    speed: 0.25,
                    relativeTo: 'node',
                    clamp: true,
                  })
                  .transform([0, 0.2, 0.21, 0.79, 0.8, 1], [0, 0.5, 1, 1, 0.5, 0]),
              }
            }}
          />
        </Col>
      </Parallax.Container>
      <Parallax.Container overflow="hidden" height="50vh" background="lightgreen">
        {views(2)}
      </Parallax.Container>
      <Parallax.Container overflow="hidden" height="100vh" background="lightpink">
        {views(3)}
      </Parallax.Container>
      <Parallax.Container overflow="hidden" height="100vh" background="lightblue">
        {views(4)}
      </Parallax.Container>
      <Parallax.Container overflow="hidden" height="100vh" background="lightgrey">
        {views(5)}
      </Parallax.Container>
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
