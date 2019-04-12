import { createContextualProps, FullScreen, View, ViewProps } from '@o/ui'
import { selectDefined } from '@o/utils'
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

Page.Content = ({ margin, position, ...sectionProps }: ViewProps) => {
  const parallax = useProps()
  const zIndex = selectDefined(sectionProps.zIndex, parallax.zIndex)
  return (
    <View
      zIndex={zIndex}
      background={sectionProps.background}
      height={window.innerHeight}
      margin={margin}
      position={position}
    >
      <SectionContent height="100%" position="relative" {...sectionProps} zIndex={zIndex} />
    </View>
  )
}

Page.Background = (props: ViewProps) => {
  const { zIndex, offset } = useProps()
  return (
    <Page.Parallax offset={offset} speed={0} style={{ zIndex: zIndex - 1 }}>
      <FullScreen {...props} />
    </Page.Parallax>
  )
}
