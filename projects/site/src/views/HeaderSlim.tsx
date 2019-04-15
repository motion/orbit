import { useTheme } from '@o/gloss'
import { BorderBottom, Row } from '@o/ui'
import React, { memo } from 'react'
import { HeaderContain, LinkSection, LinksLeft, LinksRight } from './Header'
import { LogoHorizontal } from './LogoHorizontal'

export const HeaderSlim = memo(() => {
  const theme = useTheme()
  return (
    <Row background={theme.background} position="relative">
      <HeaderContain height={32}>
        <LinkSection alignRight>
          <LinksLeft fontSize={14} />
        </LinkSection>
        <LogoHorizontal />
        <LinkSection>
          <LinksRight fontSize={14} />
        </LinkSection>
      </HeaderContain>
      <BorderBottom />
    </Row>
  )
})
