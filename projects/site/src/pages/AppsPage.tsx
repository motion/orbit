import { FullScreen, Input, View } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../views/Header'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { blackWavePattern } from './HomePage/FooterSection'

export default mount({
  '/': route({
    title: 'Apps',
    view: <AppsPage />,
  }),
})

export function AppsPage() {
  return (
    <main style={{ minHeight: 2000 }}>
      <Header position="absolute" left={0} right={0} background="transparent" slim />

      <FullScreen
        backgroundSize="200%"
        backgroundRepeat="no-repeat"
        backgroundPosition="bottom center"
        right={-200}
        left={-200}
        opacity={1}
        backgroundImage={blackWavePattern}
      />

      <SectionContent flex={1}>
        <View margin="auto">
          <Input width={400} size={2.5} placeholder="Search apps..." />
        </View>
      </SectionContent>

      <View flex={1} />

      <BlogFooter />
    </main>
  )
}

AppsPage.theme = 'home'
