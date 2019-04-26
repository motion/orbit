import { Col, FullScreen, fuzzyFilter, Grid, Image, SimpleText, Space, Theme, Title, View } from '@o/ui'
import { mount, route } from 'navi'
import React, { memo, useEffect, useState } from 'react'

import { Header } from '../views/Header'
import { SearchInput } from '../views/SearchInput'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { apps } from './HomePage/apps'
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
            <AppSearch />
          </Col>
        </SectionContent>

        <View flex={1} />

        <BlogFooter />
      </main>
    </Theme>
  )
}

AppsPage.theme = 'home'

const dim = 180

const AppSearch = memo(() => {
  let [results, setResults] = useState(appElements)

  return (
    <>
      <View margin={[0, 'auto']}>
        <SearchInput
          width={450}
          size={2.75}
          placeholder="Search apps..."
          onChange={e => {
            const search = e.target.value
            const next = fuzzyFilter(search, allApps, {
              limit: 10000,
              keys: ['title'],
            })
            setResults(next.map(x => appElements[allApps.findIndex(app => app.title === x.title)]))
          }}
        />
      </View>

      <Col pad>
        <Grid height={400} scrollable="y" space="xl" itemMinWidth={dim}>
          {results}
        </Grid>
      </Col>
    </>
  )
})

const allApps = [
  {
    title: 'Search',
    icon: require('@o/kit/public/icons/appicon-search.svg'),
  },
  {
    title: 'Lists',
    icon: require('@o/kit/public/icons/appicon-lists.svg'),
  },
  {
    title: 'People',
    icon: require('@o/kit/public/icons/appicon-people.svg'),
  },
  ...apps,
]

const appElements = allApps.map(app => (
  <Col
    key={app.title}
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    width={dim}
    height={dim}
    padding={4}
  >
    <Image width={dim * 0.6} height={dim * 0.6} src={app.icon} />
    <Space />
    <SimpleText size={0.9}>{app.title}</SimpleText>
  </Col>
))
