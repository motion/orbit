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
              speed: 1,
              relativeTo: 'frame',
              stagger: x => -x.nodeStartPct,
            })
            .transform([-1, -0.2, 0, 0.1, 1], [-2, -0.05, 0, 0.05, 3])
            .transform(x => x * 500)
            // clamp
            .transform(x => Math.max(-300, Math.min(x, 300))),
          opacity: geometry
            .useParallaxIntersection({
              speed: 1,
              relativeTo: 'frame',
              stagger: x => -x.nodeStartPct,
            })
            .transform([-1, -0.2, 0, 0.1, 1], [-5, 1, 1, 1, -10])
            // clamp
            .transform(x => Math.max(0, Math.min(x, 1))),
        }
      }}
      {...props}
    />
  )
}
