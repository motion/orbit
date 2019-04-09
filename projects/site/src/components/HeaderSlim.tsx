import { useTheme } from '@o/gloss'
import { BorderBottom, Row } from '@o/ui'
import React from 'react'
import { LogoHorizontal } from '../views/LogoHorizontal'
import { SectionContent } from '../views/SectionContent'
import { LinkSection, LinksLeft, LinksRight } from './Header'

export function HeaderSlim() {
  const theme = useTheme()
  return (
    <Row background={theme.background} position="relative">
      <SectionContent padding={0} flexFlow="row" alignItems="center" justifyContent="space-around">
        <LinkSection alignRight>
          <LinksLeft fontSize={14} />
        </LinkSection>
        <LogoHorizontal />
        <LinkSection>
          <LinksRight fontSize={14} />
        </LinkSection>
      </SectionContent>
      <BorderBottom />
    </Row>
  )
}
