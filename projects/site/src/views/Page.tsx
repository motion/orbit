import { createContextualProps, FullScreen, ViewProps } from '@o/ui'
import { selectDefined } from '@o/utils'
import * as React from 'react'
import { ParallaxLayerProps } from 'react-spring/renderprops-addons'
import { useHomestore } from '../pages/HomePage'
import { ParallaxLayer } from './Parallax'
import { SectionContent } from './SectionContent'

const { PassProps, useProps } = createContextualProps({
  offset: 0,
  zIndex: 0,
})

type PageProps = {
  offset: number
  zIndex?: number
  children: any
}

export function Page(props: PageProps) {
  return <PassProps zIndex={0} {...props} />
}

Page.Parallax = (props: ParallaxLayerProps & { children: any; zIndex?: number }) => {
  const parallax = useProps()
  const zIndex = parallax.zIndex + (props.zIndex || 0)
  return (
    // @ts-ignore
    <ParallaxLayer
      speed={0.2}
      offset={parallax.offset}
      style={{ pointerEvents: 'none', zIndex: zIndex + 1 }}
      {...props}
    />
  )
}

Page.Content = (props: ViewProps) => {
  const parallax = useProps()
  const zIndex = selectDefined(props.zIndex, parallax.zIndex)
  const homeStore = useHomestore()
  return <SectionContent height={homeStore.sectionHeight} {...props} zIndex={zIndex} />
}

Page.Background = (props: ViewProps) => {
  const { zIndex, offset } = useProps()
  return (
    <Page.Parallax offset={offset} speed={0} zIndex={zIndex - 2}>
      <FullScreen {...props} />
    </Page.Parallax>
  )
}
