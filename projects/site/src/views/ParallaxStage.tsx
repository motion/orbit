import { ParallaxViewProps } from '@o/ui'
import * as React from 'react'

import { Page } from './Page'

const startClamp = [-1, -0.4, 0, 0.4, 1.5]

export function ParallaxStageItem(props: ParallaxViewProps) {
  return (
    <Page.ParallaxView
      parallaxAnimate={geometry => {
        return {
          y: geometry
            .useParallaxIntersection({
              speed: 1,
              relativeTo: 'frame',
              // stagger: x => -x.nodeEndPct,
            })
            .transform(startClamp, [-1, -0.05, 0, 0.05, 1])
            .transform(x => x * 500)
            // clamp
            .transform(x => Math.max(-300, Math.min(x, 300))),
          opacity: geometry
            .useParallaxIntersection({
              speed: 1,
              relativeTo: 'frame',
              // stagger: x => -x.nodeEndPct,
            })
            .transform(startClamp, [-3, 1, 1, 1, -3])
            // clamp
            .transform(x => Math.max(0, Math.min(x, 1))),
        }
      }}
      {...props}
    />
  )
}
