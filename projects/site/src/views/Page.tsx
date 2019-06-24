import { createContextualProps, FullScreen, ViewProps } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { forwardRef } from 'react'
import { ParallaxLayerProps } from 'react-spring/renderprops-addons'

import { useIsTiny } from '../hooks/useScreenSize'
import { useSiteStore } from '../SiteStore'
import { ParallaxLayer } from './Parallax'
import { SectionContent, SectionContentProps } from './SectionContent'

const { PassProps, useProps } = createContextualProps({
  offset: 0,
  zIndex: 0,
  overflow: 'visible',
})

type PageProps = {
  offset: number
  zIndex?: number
  children: any
  fadeable?: boolean
  pages?: number
}

export function Page(props: PageProps) {
  return <PassProps overflow="visible" zIndex={0} {...props} />
}

Page.Parallax = ({
  overflow,
  zIndex,
  style,
  ...props
}: ParallaxLayerProps & { children: any; zIndex?: number; overflow?: any; style?: Object }) => {
  const parallax = useProps()
  const isTiny = useIsTiny()
  if (isTiny) {
    return null
  }
  return (
    <ParallaxLayer
      speed={0.2}
      offset={parallax.offset}
      style={{
        pointerEvents: 'none',
        zIndex: parallax.zIndex + (zIndex || 0) + 1,
        overflow: selectDefined(overflow, parallax.overflow),
        ...style,
      }}
      {...props}
    />
  )
}

Page.Content = forwardRef((props: SectionContentProps, ref) => {
  const parallax = useProps()
  const zIndex = parallax.zIndex + +(props.zIndex || 0) + 2
  const siteStore = useSiteStore()
  const isTiny = useIsTiny()
  return (
    <SectionContent
      forwardRef={ref}
      className="page-content"
      height={siteStore.sectionHeight * (props.pages || 1)}
      paddingTop={30}
      paddingBottom={30}
      {...props}
      zIndex={zIndex}
      flex="none"
      {...isTiny && {
        height: 'auto',
        minHeight: 'auto',
      }}
    />
  )
})

Page.Background = ({ speed = 0, ...props }: ViewProps & { speed?: number }) => {
  const { zIndex, offset } = useProps()
  return (
    <Page.Parallax offset={offset} speed={speed} zIndex={(props.zIndex || 0) + zIndex - 2}>
      <FullScreen transition="all ease 1000ms" className="page-background" {...props} />
    </Page.Parallax>
  )
}
