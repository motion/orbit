import { useTheme } from '@o/gloss'
import { BorderBottom, Row } from '@o/ui'
import React, { memo } from 'react'
import { LinkSection, LinksLeft, LinksRight } from './Header'
import { Logos } from './Logos'
import { SectionContent } from './SectionContent'

export const HeaderSlim = memo(() => {
  const theme = useTheme()
  return (
    <Row height={36} background={theme.background} position="relative">
      <SectionContent padding={0} flexFlow="row" alignItems="center" justifyContent="space-around">
        <LinkSection alignRight>
          <LinksLeft fontSize={14} />
        </LinkSection>
        <Logos show="horizontal" />
        <LinkSection>
          <LinksRight fontSize={14} />
        </LinkSection>
      </SectionContent>
      <BorderBottom />
    </Row>
  )
})
