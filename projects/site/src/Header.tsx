import { BorderBottom, Button, Row, RowProps } from '@o/ui'
import { Box, gloss, useTheme } from 'gloss'
import React, { memo, useLayoutEffect, useState } from 'react'

import { useScreenSize } from './hooks/useScreenSize'
import { LinkState } from './LinkState'
import { useSiteStore } from './SiteStore'
import { FadeChild, transitions, useFadePage } from './views/FadeInView'
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
  const theme = useTheme()
  const siteStore = useSiteStore()
  const headerStore = HeaderContext.useCreateStore()
  const { shown } = headerStore
  const Fade = useFadePage({ shown, threshold: 0 })

  useScreenSize({
    onChange(size) {
      if (size === 'small') {
        headerStore.setShown(siteStore.showSidebar)
      } else {
        headerStore.setShown(true)
      }
    },
  })

  return (
    <HeaderContext.ProvideStore value={headerStore}>
      {/* large */}
      <Fade.FadeProvide>
        <Row
          nodeRef={Fade.ref}
          position="absolute"
          xs-position="relative"
          top={0}
          left={0}
          right={0}
          zIndex={1000000}
          alignItems="center"
          justifyContent="space-around"
          padding={[30, 0]}
          opacity={slim ? 0 : 1}
          pointerEvents={slim ? 'none' : 'auto'}
          {...rest}
        >
          <HeaderContain>
            <LinkSection alignRight>
              <LinkRow>
                <LinksLeft />
              </LinkRow>
            </LinkSection>
            <FadeChild
              // disable={!LinkState.didAnimateOut}
              transition={shown ? transitions.normal : transitions.fastStatic}
              delay={shown ? 100 : 0}
            >
              <LogoVertical />
            </FadeChild>
            <LinkSection>
              <LinkRow>
                <LinksRight />
              </LinkRow>
            </LinkSection>
          </HeaderContain>
        </Row>
        {/* small */}
        <Button
          sm-opacity={0}
          sm-pointerEvents="none"
          className="fixed-menu"
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
        <Row
          pointerEvents="auto"
          background={theme.background.lighten(0.05)}
          position="relative"
          zIndex={1000000}
          opacity={slim ? 1 : 0}
          {...rest}
        >
          <HeaderContain height={50}>
            <FadeChild
              disable={!LinkState.didAnimateOut}
              transition={shown ? transitions.normal : transitions.fastStatic}
              delay={shown ? 0 : 0}
            >
              <LogoHorizontal slim />
            </FadeChild>
          </HeaderContain>
          {!noBorder && <BorderBottom opacity={0.5} />}
        </Row>
      </Fade.FadeProvide>
    </HeaderContext.ProvideStore>
  )
})

const LinkRow = gloss(Box, {
  flexDirection: 'row',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  position: 'relative',
})
