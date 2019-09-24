import { ParallaxViewProps } from '@o/ui'
import * as React from 'react'

import { Page } from './Page'

export function ParallaxStageItem(props: ParallaxViewProps) {
  return (
    <Page.ParallaxView
      parallaxAnimate={geometry => {
        return {
          y: geometry
            .useParallaxIntersection({
              speed: 0.25,
              relativeTo: 'node',
              clamp: true,
            })
            .transform([0, 0.2, 0.21, 0.79, 0.8, 1], [-2, 0.2, 0.21, 0.79, 0.8, 3])
            .transform(geometry.transforms.scrollNodeSize),
          opacity: geometry
            .useParallaxIntersection({
              speed: 0.25,
              relativeTo: 'node',
              clamp: true,
            })
            .transform([0, 0.2, 0.21, 0.79, 0.8, 1], [0, 0.5, 1, 1, 0.5, 0]),
        }
      }}
      {...props}
    />
  )
}
