import { createContextualProps, FullScreen, ViewProps } from '@o/ui'
import * as React from 'react'
import { ParallaxLayerProps } from 'react-spring/renderprops-addons'
import { useSiteStore } from '../Layout'
import { ParallaxLayer } from './Parallax'
import { SectionContent, SectionContentProps } from './SectionContent'

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

Page.Parallax = ({
  overflow,
  zIndex,
  style,
  ...props
}: ParallaxLayerProps & { children: any; zIndex?: number; overflow?: any; style?: Object }) => {
  const parallax = useProps()
  return (
    // @ts-ignore
    <ParallaxLayer
      speed={0.2}
      offset={parallax.offset}
      style={{
        pointerEvents: 'none',
        zIndex: parallax.zIndex + (zIndex || 0) + 1,
        overflow,
        ...style,
      }}
      {...props}
    />
  )
}

Page.Content = (props: SectionContentProps) => {
  const parallax = useProps()
  const zIndex = parallax.zIndex + +(props.zIndex || 0) + 2
  console.log('zIndex', zIndex)
  const siteStore = useSiteStore()
  return (
    <SectionContent
      className="page-content"
      height={siteStore.sectionHeight}
      {...props}
      zIndex={zIndex}
    />
  )
}

Page.Background = (props: ViewProps) => {
  const { zIndex, offset } = useProps()
  return (
    <Page.Parallax offset={offset} speed={0} zIndex={zIndex - 2}>
      <FullScreen transition="all ease 1000ms" className="page-background" {...props} />
    </Page.Parallax>
  )
}
