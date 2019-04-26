import { Space, Theme } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../views/Header'
import { SectionContent } from '../views/SectionContent'
import { EarlyAccessContent, LineSep } from './HomePage/EarlyAccessBetaSection'
import { Footer } from './HomePage/FooterSection'

export default mount({
  '/': route({
    title: 'Beta',
    view: <BetaPage />,
  }),
})

export function BetaPage() {
  return (
    <Theme name="orbitOne">
      <Header slim noBorder background="transparent" />
      <LineSep top={30} />
      <EarlyAccessContent />
      <SectionContent minHeight={450} position="relative" padding={[100, 32]}>
        <Footer />
        <Space size="xl" />
      </SectionContent>

      <LineSep top="auto" bottom={20} transform={{ scaleX: -1 }} />
    </Theme>
  )
}

BetaPage.theme = 'orbitOne'
