import { gloss, useTheme } from 'gloss'
import { BorderBottom, Button, Row, RowProps } from '@o/ui'
import React, { useState } from 'react'

import { useIsTiny, useScreenSize } from '../hooks/useScreenSize'
import { LinkState } from '../pages/HomePage/linkProps'
import { useSiteStore } from '../SiteStore'
import { defaultConfig, FadeChild, fastStatticConfig, useFadePage } from './FadeIn'
import { HeaderContain, LinkSection } from './HeaderContain'
import { HeaderContext } from './HeaderContext'
import { LinksLeft, LinksRight } from './HeaderLink'
import { LogoHorizontal } from './LogoHorizontal'
import { LogoVertical } from './LogoVertical'

const LinkRow = gloss({
  flexFlow: 'row',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  position: 'relative',
})

export function Header({
  slim,
  noBorder,
  ...rest
}: { slim?: boolean; noBorder?: boolean } & RowProps) {
  const isTiny = useIsTiny()
  const size = useScreenSize()
  const theme = useTheme()
  const siteStore = useSiteStore()
  const [shown, setShown] = useState(true)
  const Fade = useFadePage({ shown, threshold: 0 })

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

  let children
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
          ref={Fade.ref}
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
              config={shown ? defaultConfig : fastStatticConfig}
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
          ref={Fade.ref}
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
              config={shown ? defaultConfig : fastStatticConfig}
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

  return (
    <HeaderContext.PassProps setShown={setShown} shown={shown}>
      {children}
    </HeaderContext.PassProps>
  )
}
