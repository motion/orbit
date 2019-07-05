import { Button, Card, Row, Title, View } from '@o/ui'
import React from 'react'

export const TestCarousel = () => {
  const apps = [{ title: 'ok' }, { title: 'ok2' }, { title: 'ok3' }, { title: 'o4' }]
  const carousel = animation(() => ({
    scrollLeft: 0,
    zoomed: false,
  }))
  /**
   * animation() is a helper, but desugars into props somewhat like:
   *    scrollLeft={spring(...)}
   *    animated
   * it lets us control it using .set without being fully controlled
   */
  return (
    <View width="100%" height="100%">
      <Button onClick={() => carousel.set(cur => ({ zoomed: !cur.zoomed }))}>zoom</Button>
      <Button onClick={() => carousel.set(cur => ({ scrollLeft: 100 + cur.scrollLeft }))}>
        scroll 100px right
      </Button>
      <Row flex={1} scrollable {...carousel}>
        {apps.map((app, index) => (
          <Geometry key={index} leftIndex={index}>
            {geometry => (
              <Card
                onClick={() => {
                  carousel.set({
                    scrollLeft: geometry.frame(),
                  })
                }}
                onDoubleClick={() => {
                  carousel.set(current => ({
                    scrollLeft: geometry.frame(),
                    zoomed: !current.zoomed,
                  }))
                }}
                transform={{
                  rotateY: () => (index - geometry.frame()) * 10,
                  scale: () => (carousel.zoomed ? 1 : Math.abs(geometry.frame())),
                }}
              >
                <Title>{app.title}</Title>
              </Card>
            )}
          </Geometry>
        ))}
      </Row>
    </View>
  )
}

const Geometry: any = null
const animation: any = () => {}
