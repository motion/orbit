import { Col, FullScreen, Theme, Title, View } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../views/Header'
import { SearchInput } from '../views/SearchInput'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { makeWavePattern } from './makeWavePattern'

export default mount({
  '/': route({
    title: 'Apps',
    view: <AppsPage />,
  }),
})

export function AppsPage() {
  return (
    <Theme name={AppsPage.theme}>
      <FullScreen
        position="fixed"
        backgroundSize="200%"
        backgroundRepeat="no-repeat"
        backgroundPosition="bottom center"
        right={-200}
        left={-200}
        opacity={0.5}
        backgroundImage={makeWavePattern('#333')}
        pointerEvents="none"
      />

      <main style={{ minHeight: 1600 }}>
        <Header position="absolute" left={0} right={0} background="transparent" slim />

        <SectionContent flex={1} marginTop={54} paddingTop="5%" paddingBottom="5%">
          <Col space="lg">
            <Title margin={[0, 'auto']}>Discover apps</Title>

            <View margin={[0, 'auto']}>
              <SearchInput width={450} size={2.75} placeholder="Search apps..." />
            </View>
          </Col>
        </SectionContent>

        <View flex={1} />

        <BlogFooter />
      </main>
    </Theme>
  )
}

AppsPage.theme = 'home'
