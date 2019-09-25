import { ParallaxViewProps } from '@o/ui'
import * as React from 'react'

import { Page } from './Page'

const startClamp = [-1, -0.15, 0, 0.3, 1.5]

const useIf = (option: boolean | string[] | any, key: string, value: () => any) => {
  if (option === true) return { [key]: value() }
  if (option === false) return null
  if (option.includes(key)) return { [key]: value() }
  return null
}

export type ParallaxProp = boolean | ('y' | 'opacity')[] | ParallaxViewProps['parallax']

type ParallaxStageItemProps = Omit<ParallaxViewProps, 'parallax'> & {
  parallax?: ParallaxProp
}

function getParallax(props: ParallaxStageItemProps) {
  if (typeof props.parallax === 'function') {
    return props.parallax
  }
  return geometry => ({
    ...useIf(props.parallax, 'y', () =>
      geometry
        .useParallaxIntersection({
          speed: props.speed,
          relativeTo: 'frame',
        })
        .transform(startClamp, [-2, -0.025, 0, 0.025, 0])
        .transform(x => x * 250)
        // clamp
        .transform(x => Math.max(-500, Math.min(x, 500))),
    ),
    ...useIf(props.parallax, 'opacity', () =>
      geometry
        .useParallaxIntersection({
          speed: 1,
          relativeTo: 'frame',
        })
        .transform(startClamp, [-3, 1, 1, 1, 1])
        // clamp
        .transform(x => Math.max(0, Math.min(x, 1))),
    ),
  })
}

export function ParallaxStageItem(props: ParallaxStageItemProps) {
  return <Page.ParallaxView {...props} parallax={getParallax(props)} />
}

ParallaxStageItem.defaultProps = {
  speed: 1,
  parallax: true,
}
