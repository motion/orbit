import { createContextualProps, Parallax, ParallaxViewProps } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { memo, useEffect, useState } from 'react'

import { mediaStyles } from '../constants'
import { useSiteStore } from '../SiteStore'
import { SectionContent, SectionContentProps } from './SectionContent'

const { PassProps, useProps } = createContextualProps<SectionContentProps>({
  zIndex: 0,
  overflow: 'visible',
})

export function Page(props: SectionContentProps) {
  const siteStore = useSiteStore()
  return (
    <PassProps overflow="visible" zIndex={0} {...props}>
      <Parallax.Container>
        <SectionContent
          className="page"
          // height={props.pages === 'auto' ? 'auto' : siteStore.sectionHeight * (props.pages || 1)}
          height="100vh"
          alignItems="center"
          justifyContent="center"
          {...props}
          flex="none"
          xs-height="auto"
          xs-minHeight="auto"
        />
      </Parallax.Container>
    </PassProps>
  )
}

Page.ParallaxView = ({ overflow, zIndex, style, ...props }: ParallaxViewProps) => {
  const parallax = useProps()
  return (
    <Parallax.View
      {...mediaStyles.hiddenWhen.xs}
      speed={0.2}
      style={{
        // pointerEvents: 'none',
        zIndex: +parallax.zIndex + (+zIndex || 0) + 1,
        overflow: selectDefined(overflow, parallax.overflow),
        ...style,
      }}
      {...props}
    />
  )
}

Page.BackgroundParallax = memo((props: ParallaxViewProps) => {
  const { zIndex } = useProps()
  const [shown, setShown] = useState()
  useEffect(() => {
    setShown(true)
  }, [])
  return (
    <Page.ParallaxView
      zIndex={(props.zIndex || 0) + zIndex - 2}
      className="page-background"
      transition="opacity ease 1500ms"
      position="absolute"
      left="5%"
      right="5%"
      top="2%"
      bottom="2%"
      {...props}
      opacity={shown ? props.opacity || 1 : 0}
    />
  )
})
