import { BorderBottom, Button, Row, RowProps } from '@o/ui'
import { Box, gloss, useTheme } from 'gloss'
import React, { memo, useLayoutEffect, useState } from 'react'

import { useIsTiny, useScreenSize } from './hooks/useScreenSize'
import { LinkState } from './LinkState'
import { useSiteStore } from './SiteStore'
import { fadeAnimations, FadeChild, useFadePage } from './views/FadeInView'
import { HeaderContain, LinkSection } from './views/HeaderContain'
import { HeaderContext } from './views/HeaderContext'
import { LinksLeft, LinksRight } from './views/HeaderLink'
import { LogoHorizontal } from './views/LogoHorizontal'
import { LogoVertical } from './views/LogoVertical'

export type HeaderProps = {
  slim?: boolean
  noBorder?: boolean
} & RowProps

export const Header = memo(({ slim, noBorder, ...rest }: HeaderProps) => {
  const isTiny = useIsTiny()
  const size = useScreenSize()
  const theme = useTheme()
  const siteStore = useSiteStore()
  const headerStore = HeaderContext.useCreateStore()
  const { shown } = headerStore
  const Fade = useFadePage({ shown, threshold: 0 })

  useLayoutEffect(() => {
    if (size === 'small') {
      headerStore.setShown(siteStore.showSidebar)
    } else {
      headerStore.setShown(true)
    }
  }, [size, siteStore.showSidebar])

  let before = null
  let after = null
  if (size !== 'small') {
    before = (
      <LinkRow>
        <LinksLeft />
      </LinkRow>
    )
    after = (
      <LinkRow>
        <LinksRight />
      </LinkRow>
    )
  }

  let children = null
  const menuElement = size === 'small' && (
    <Button
      position="fixed"
      top={3}
      right={10}
      zIndex={1000000000}
      icon="menu"
      iconSize={16}
      size={2}
      chromeless
      onClick={siteStore.toggleSidebar}
    />
  )

  if (slim) {
    children = (
      <Fade.FadeProvide>
        {menuElement}
        <Row
          nodeRef={Fade.ref}
          pointerEvents="auto"
          background={theme.background.lighten(0.05)}
          position="relative"
          zIndex={1000000}
          {...rest}
        >
          <HeaderContain height={50}>
            <LinkSection alignRight>{before}</LinkSection>
            <FadeChild
              off={!LinkState.didAnimateOut}
              {...(shown ? fadeAnimations.normal : fadeAnimations.fastStatic)}
              delay={shown ? 0 : 0}
            >
              <LogoHorizontal slim />
            </FadeChild>
            <LinkSection>{after}</LinkSection>
          </HeaderContain>
          {!noBorder && <BorderBottom opacity={0.5} />}
        </Row>
      </Fade.FadeProvide>
    )
  } else {
    children = (
      <Fade.FadeProvide>
        {menuElement}
        <Row
          nodeRef={Fade.ref}
          position={isTiny ? 'relative' : 'absolute'}
          top={0}
          left={0}
          right={0}
          zIndex={1000000}
          alignItems="center"
          justifyContent="space-around"
          padding={[30, 0]}
          {...rest}
        >
          <HeaderContain>
            <LinkSection alignRight>{before}</LinkSection>
            <FadeChild
              off={!LinkState.didAnimateOut}
              config={shown ? fadeAnimations.normal : fadeAnimations.fastStatic}
              delay={shown ? 100 : 0}
            >
              <LogoVertical />
            </FadeChild>
            <LinkSection>{after}</LinkSection>
          </HeaderContain>
        </Row>
      </Fade.FadeProvide>
    )
  }

  return <HeaderContext.ProvideStore value={headerStore}>{children}</HeaderContext.ProvideStore>
})

const LinkRow = gloss(Box, {
  flexDirection: 'row',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  position: 'relative',
})
