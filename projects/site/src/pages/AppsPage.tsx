import { Col, FullScreen, fuzzyFilter, gloss, Grid, HotKeys, Image, SimpleText, Space, Theme, Title, View } from '@o/ui'
import { useStore } from '@o/use-store'
import { mount, route } from 'navi'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { Header } from '../views/Header'
import { PillButton } from '../views/PillButton'
import { SearchInput } from '../views/SearchInput'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { apps } from './HomePage/apps'
import { useScreenVal } from './HomePage/SpacedPageContent'
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
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="bottom center"
        right={-200}
        left={-200}
        opacity={0.5}
        backgroundImage={makeWavePattern('#333')}
        pointerEvents="none"
      />

      <Header noBorder position="absolute" left={0} right={0} background="transparent" slim />
      <main className="main-contents" style={{ minHeight: 1600 }}>
        <SectionContent flex={1} marginTop={54} paddingTop="5%" paddingBottom="5%">
          <Col space="xxxl">
            <Title size="xxl" margin={[0, 'auto']}>
              Discover apps
            </Title>
            <AppSearch />
          </Col>
        </SectionContent>

        <SectionContent id="faq" minHeight={400} background="#000">
          <Col
            pad={useScreenVal(0, [50, '10%'], [100, '20%', 100])}
            space="xxl"
            spaceAround
            flex={1}
            overflow="hidden"
            className="content"
          >
            <PillButton>FAQ</PillButton>

            <Space />

            <FAQItem
              question="What exactly is an Orbit app?"
              main="Orbit apps can either provide data, or show data. Any app can then access another apps
              data, with permission."
              paragraphs={[
                <>
                  This is a new way to think about apps: as small services that can talk to each
                  other.
                </>,
                <>
                  For example, the Slack app has a `getMessagesInRoom()` method on it's API, along
                  with every other one from the public Slack API.
                </>,
              ]}
            />

            <FAQItem
              question="How do apps communicate?"
              main="There are two ways: either they sync data in, or expose an API."
              paragraphs={[
                <>
                  The API is used for "one time only" access. Any app can use another API to and
                  then show the results. When you use `useApp()`, you get back an entire API thats
                  been converted into a loadable, suspense-style call you can make inline in your
                  views.
                </>,
                <>
                  Meanwhile, sync functionality is more interesting. Any app can create data at
                  runtime with the `useAppData` hook. But if they want to sync a larger amount of
                  data for searching, they can define a sync process and save bits. This puts data
                  into a local SQLite database.
                </>,
              ]}
            />

            <FAQItem
              question="How do apps sync without a server?"
              main="A combination of doing local syncing directly with OAuth services, with a light
              p2p layer that handles coordinating configuration, auth, and simple appData."
              paragraphs={[
                <>
                  Orbit began as a knowledge unification app, and we realized early on that there
                  was a fundamental misalignment between syncing large amounst of data and user
                  experience, trust, privacy, and security.
                </>,
                <>
                  So, we developed a system that puts the user first. It lets you write apps that
                  run behind your firewall.
                </>,
              ]}
            />
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

const FAQItem = ({ main, paragraphs, question }) => {
  return (
    <>
      <Col space="xl">
        <Title selectable size={1} fontWeight={600}>
          {question}
        </Title>

        <Title selectable size={2.5} sizeLineHeight={1.3} fontWeight={100}>
          {main}
        </Title>

        {paragraphs.map((p, i) => (
          <Title key={i} selectable size={1.5} alpha={0.6} fontWeight={300} sizeLineHeight={1.25}>
            {p}
          </Title>
        ))}
      </Col>
      <Space size="xxxl" />
    </>
  )
}

class AppsStore {
  filteredApps = allApps
  active = 0

  get results() {
    return this.filteredApps.map((x, index) => {
      return (
        <AppItem key={x.title} isActive={index === this.active}>
          {appElements[allApps.findIndex(app => app.title === x.title)]}
        </AppItem>
      )
    })
  }

  up() {
    this.active = Math.max(0, this.active - 1)
  }

  down() {
    this.active = Math.min(this.results.length - 1, this.active + 1)
  }
}

const keyMap = {
  up: 'up',
  down: 'down',
}

const AppSearch = memo(() => {
  const store = useStore(AppsStore)
  const onChange = useCallback(e => {
    const search = e.target.value
    store.filteredApps = fuzzyFilter(search, allApps, {
      limit: 10000,
      keys: ['title'],
    })
  }, [])

  const handlers = useMemo(
    () => ({
      up: store.up,
      down: store.down,
    }),
    [],
  )

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <View margin={[0, 'auto']}>
        <SearchInput width={450} size={2.75} placeholder="Search apps..." onChange={onChange} />
        <Space size="xxxl" />
      </View>

      <Col pad>
        <Grid alignItems="flex-start" height={640} space="xl" itemMinWidth={dim}>
          {store.results}
        </Grid>
      </Col>
    </HotKeys>
  )
})

const AppItem = gloss({
  width: dim,
  height: dim,

  isActive: {
    boxShadow: [[0, 0, 10, 'blue']],
  },
})

const allApps = [
  {
    title: 'Search',
    icon: require('../assets/appicon-search.svg'),
  },
  {
    title: 'Lists',
    icon: require('../assets/appicon-lists.svg'),
  },
  {
    title: 'People',
    icon: require('../assets/appicon-people.svg'),
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
