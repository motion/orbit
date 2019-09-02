import { createContextualProps, FullScreen, Parallax, ViewProps } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { forwardRef } from 'react'

import { useIsTiny } from '../hooks/useScreenSize'
import { useSiteStore } from '../SiteStore'
import { SectionContent, SectionContentProps } from './SectionContent'

const { PassProps, useProps } = createContextualProps({
  offset: 0,
  zIndex: 0,
  overflow: 'visible',
})

export function Page(props: SectionContentProps) {
  const siteStore = useSiteStore()
  const isTiny = useIsTiny()
  return (
    <PassProps overflow="visible" zIndex={0} {...props}>
      <Parallax.Container>
        <SectionContent
          className="page"
          height={siteStore.sectionHeight * (props.pages || 1)}
          paddingTop={30}
          paddingBottom={30}
          {...props}
          flex="none"
          {...isTiny && {
            height: 'auto',
            minHeight: 'auto',
          }}
        />
      </Parallax.Container>
    </PassProps>
  )
}

Page.Parallax = ({
  overflow,
  zIndex,
  style,
  ...props
}: {
  children: any
  zIndex?: number
  overflow?: any
  style?: Object
}) => {
  const parallax = useProps()
  const isTiny = useIsTiny()
  if (isTiny) {
    return null
  }
  return (
    <Parallax.View
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

Page.Background = ({ speed = 0, ...props }: ViewProps & { speed?: number }) => {
  const { zIndex, offset } = useProps()
  return (
    <Page.Parallax offset={offset} speed={speed} zIndex={(props.zIndex || 0) + zIndex - 2}>
      <FullScreen transition="all ease 1000ms" className="page-background" {...props} />
    </Page.Parallax>
  )
}
