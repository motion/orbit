import { Button, Card, Geometry, Stack, Title, View } from '@o/ui'
import React, { useRef, useState } from 'react'

export const TestCarousel = () => {
  const apps = ['ok', 'ok2', 'ok3', 'ok4']
  const [zoom, setZoom] = useState(false)
  const carousel = useRef<HTMLElement>(null)
  return (
    <View width="100%" height="100%">
      <Button onClick={() => setZoom(!zoom)}>zoom</Button>
      <Button onClick={() => (carousel.current.scrollLeft += 100)}>scroll 100px right</Button>
      <Stack direction="horizontal" ref={carousel} flex={1} scrollable="x" space={100}>
        {apps.map((app, index) => (
          <Geometry key={index} frame={carousel}>
            {geometry => (
              <Card
                onClick={() => {
                  carousel.current.scrollLeft = geometry.offset(index)
                }}
                onDoubleClick={() => {
                  carousel.current.scrollLeft = geometry.offset(index)
                  setZoom(false)
                }}
                animation={{
                  mass: 10,
                  friction: 20,
                  velocity: 100,
                }}
                transform={{
                  rotateY: () => (index - geometry.frame(index)) * 10,
                  scale: () => (zoom ? 1 : Math.abs(geometry.frame(index))),
                }}
              >
                <Title>{app}</Title>
              </Card>
            )}
          </Geometry>
        ))}
      </Stack>
    </View>
  )
}
