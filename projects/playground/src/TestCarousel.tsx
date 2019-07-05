import { animation, Button, Card, Geometry, Row, Title, View } from '@o/ui'
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
   * lets us control it using .set without being fully controlled
   */
  return (
    <View width="100%" height="100%">
      <Button onClick={() => carousel.set(cur => ({ zoomed: !cur.zoomed }))}>zoom</Button>
      <Button onClick={() => carousel.set(cur => ({ scrollLeft: 100 + cur.scrollLeft }))}>
        scroll 100px right
      </Button>
      <Row flex={1} scrollable="x" space={100} {...carousel}>
        {apps.map((app, index) => (
          <Geometry key={index}>
            {geometry => (
              <Card
                onClick={() => {
                  carousel.set({
                    scrollLeft: geometry.offset(index),
                  })
                }}
                onDoubleClick={() => {
                  carousel.set(current => ({
                    scrollLeft: geometry.offset(index),
                    zoomed: !current.zoomed,
                  }))
                }}
                transform={{
                  rotateY: () => (index - geometry.frame(index)) * 10,
                  scale: () => (carousel.zoomed ? 1 : Math.abs(geometry.frame(index))),
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

// alternate

export const TestCarousel2 = () => {
  const apps = [{ title: 'ok' }, { title: 'ok2' }, { title: 'ok3' }, { title: 'o4' }]
  const carousel = animation(() => ({
    scrollLeft: 0,
    zoomed: false,
  }))
  /**
   * animation() is a helper, but desugars into props somewhat like:
   *    scrollLeft={spring(...)}
   *    animated
   * lets us control it using .set without being fully controlled
   */
  return (
    <View width="100%" height="100%">
      <Button onClick={() => carousel.set(cur => ({ zoomed: !cur.zoomed }))}>zoom</Button>
      <Button onClick={() => carousel.set(cur => ({ scrollLeft: 100 + cur.scrollLeft }))}>
        scroll 100px right
      </Button>
      <Row flex={1} scrollable="x" space={100} {...carousel}>
        {apps.map((app, index) => (
          <Geometry key={index}>
            {geometry => (
              <Card
                onClick={() => {
                  carousel.set({
                    scrollLeft: geometry.offset(index),
                  })
                }}
                onDoubleClick={() => {
                  carousel.set(current => ({
                    scrollLeft: geometry.offset(index),
                    zoomed: !current.zoomed,
                  }))
                }}
                transform={{
                  rotateY: () => (index - geometry.frame(index)) * 10,
                  scale: () => (carousel.zoomed ? 1 : Math.abs(geometry.frame(index))),
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
