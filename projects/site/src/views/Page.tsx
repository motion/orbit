import { createContextualProps, View, ViewProps } from '@o/ui'
import * as React from 'react'
import { ParallaxLayer, ParallaxLayerProps } from 'react-spring/renderprops-addons'
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

Page.Parallax = (props: ParallaxLayerProps & { children: any }) => {
  const { zIndex } = useProps()
  return (
    // @ts-ignore
    <ParallaxLayer speed={0.2} style={{ pointerEvents: 'none', zIndex: zIndex + 1 }} {...props} />
  )
}

Page.Content = (props: ViewProps) => {
  const parallax = useProps()
  return (
    <View background={props.background} height={window.innerHeight}>
      <SectionContent height="100%" position="relative" {...props} zIndex={parallax.zIndex} />
    </View>
  )
}
