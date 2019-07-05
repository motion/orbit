import { Card, Row, Title, View } from '@o/ui'
import React, { useState } from 'react'

const useAnimation: any = () => {}
const useParentAnimation = useAnimation

export const TestCarousel = () => {
  const apps = [{ title: 'ok' }, { title: 'ok2' }, { title: 'ok3' }, { title: 'o4' }]
  const animation = useAnimation({
    scrollLeft: 0,
    zoomed: false,
  })
  return (
    <View width="100%" height="100%">
      <button onClick={() => animation.set(cur => ({ zoomed: !cur.zoomed }))}>zoom</button>
      <button onClick={() => animation.set({ scrollLeft: 100 })}>scroll to offset 100</button>
      <Row flex={1} scrollable {...animation}>
        {apps.map((app, index) => (
          <CarouselItem key={index} index={index} app={app} />
        ))}
      </Row>
    </View>
  )
}

const CarouselItem = ({ app, index }: any) => {
  const [width, setWidth] = useState(0)
  const animation = useParentAnimation()
  return (
    <Card
      onResize={({ width }) => setWidth(width)}
      onClick={() => {
        animation.set({
          scrollLeft: index * width,
        })
      }}
      onDoubleClick={() => {
        animation.set(current => ({
          scrollLeft: index * width,
          zoomed: !current.zoomed,
        }))
      }}
      {...animation.useAnimation(context => {
        // not sure here best strategy
        const intersection = context.getChildIntersection(index, width)
        return {
          transform: {
            rotateY: (index - intersection) * 10,
            scale: context.zoomed ? 1 : Math.abs(intersection),
          },
        }
      })}
    >
      <Title>{app.title}</Title>
    </Card>
  )
}
