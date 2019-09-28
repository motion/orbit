import { FullScreen, fuzzyFilter, gloss, Grid, HotKeys, Image, SimpleText, SizedSurface, Space, Stack, SubTitle, Theme, Title, View } from '@o/ui'
import { createStoreContext } from '@o/use-store'
import { Box } from 'gloss'
import { mount, route } from 'navi'
import React, { memo, useCallback, useMemo } from 'react'

import { fontProps } from '../constants'
import { Header } from '../Header'
import { Paragraph } from '../views/Paragraph'
import { PillButton } from '../views/PillButton'
import { SearchInput } from '../views/SearchInput'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { BlogFooter } from './BlogPage/BlogLayout'
import { apps } from './HomePage/apps'
import { makeWavePattern } from './makeWavePattern'

export default mount({
  '/': route({
    title: 'Apps',
    view: <AppsPage />,
  }),
})

class AppsStore {
  filteredApps = allApps
  active = 0

  get activeApp() {
    return this.filteredApps[this.active]
  }

  get results() {
    return this.filteredApps.map((x, index) => {
      return (
        <AppItem
          key={x.title}
          isActive={index === this.active}
          onClick={() => (this.active = index)}
        >
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

const AppStoreContext = createStoreContext(AppsStore)

export function AppsPage() {
  return (
    <AppStoreContext.Provider>
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
            <Stack space="xxxl">
              <TitleText size="lg" textAlign="center" margin={[0, 'auto']}>
                Discover apps
              </TitleText>
              <AppSearch />
            </Stack>
          </SectionContent>

          <AppDescription />

          <SectionContent id="faq" background="#050505">
            <Space size="xxxl" />

            <Stack
              className="faq-section content"
              padding={[50, '15%']}
              sm-padding="0"
              space="xxl"
              spaceAround
              flex={1}
              overflow="hidden"
            >
              <PillButton>FAQ</PillButton>

              <Space size="xxxl" />

              <FAQItem
                question="What exactly is an Orbit app?"
                main="Orbit apps can either provide data, or show data. Any app can then access another apps
              data, with permission."
                paragraphs={[
                  <>
                    This is a new way to think about apps: as small components and services that can
                    display each other and use each others APIs, all in a shared workspace.
                  </>,
                  <>
                    A small example would be the Slack app. It has all the methods from the Slack
                    API, like getMessagesInRoom() and getRooms(), as well as GraphQL endpoints. It
                    also has a view that will automatically display any slack conversation as a
                    formatted list of messages.
                  </>,
                  <>
                    So once you install the Slack app to your workspace you can create a new app to
                    leverage these APIs and views to build your own custom apps.
                  </>,
                ]}
              />

              <FAQItem
                question="How do apps communicate?"
                main="There are two ways: syncing data in, or expose an API."
                paragraphs={[
                  <>
                    The API is used for "one time only" access. Any app can use another API to and
                    then show the results. When you use `useApp()`, you get back an entire API thats
                    been converted into a loadable, suspense-style call you can make inline in your
                    views.
                  </>,
                  <>
                    Meanwhile, sync functionality is more interesting. Any app can create data at
                    runtime with the 'useAppData' hook. But if they want to sync a larger amount of
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
            </Stack>
          </SectionContent>

          <View flex={1} />

          <BlogFooter />
        </main>
      </Theme>
    </AppStoreContext.Provider>
  )
}

AppsPage.theme = 'dark'

const dim = 180

const AppDescription = () => {
  const { activeApp } = AppStoreContext.useStore()
  return (
    <SectionContent background="red" height={0} zIndex={100000}>
      <Theme name="dark">
        <SizedSurface
          margin={[-75, 'auto']}
          height={155}
          padding
          size={2}
          sizeRadius={2}
          elevation={100}
          width="50%"
          minWidth={340}
          hoverStyle={false}
          activeStyle={false}
        >
          <Stack flex={1} space="sm">
            <SubTitle alpha={1} fontWeight={600} margin={[0, 'auto']} size="lg">
              {activeApp.title}
            </SubTitle>
            <Paragraph selectable size={1.25} alpha={0.6} fontWeight={300} sizeLineHeight={1.2}>
              {activeApp.description}
            </Paragraph>
          </Stack>
        </SizedSurface>
      </Theme>
    </SectionContent>
  )
}

const FAQItem = ({ main, paragraphs, question }) => {
  return (
    <>
      <Stack space="lg">
        <Title selectable size="xxs" fontWeight={500}>
          {question}
        </Title>

        <Title selectable size="sm" sizeLineHeight={1.3} fontWeight={100}>
          {main}
        </Title>

        {paragraphs.map((p, i) => (
          <Title
            key={i}
            selectable
            size="xxxs"
            alpha={0.65}
            fontWeight={300}
            sizeLineHeight={1.25}
            {...fontProps.BodyFont}
          >
            {p}
          </Title>
        ))}
      </Stack>
      <Space size="xxxl" />
    </>
  )
}

const keyMap = {
  up: 'up',
  down: 'down',
}

const AppSearch = memo(() => {
  const store = AppStoreContext.useStore()
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
    <HotKeys
      keyMap={keyMap}
      handlers={handlers}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <View margin={[0, 'auto']}>
        <SearchInput
          width={450}
          size={1.75}
          placeholder={`Search all apps...`}
          onChange={onChange}
        />
        <Space size="xxxl" />
      </View>

      <Stack padding>
        <Grid alignItems="flex-start" height={dim * 2 + 60} space="xl" itemMinWidth={dim}>
          {store.results}
        </Grid>
        <Space size="lg" />
      </Stack>
    </HotKeys>
  )
})

const AppItem = gloss(Box, {
  width: dim,
  height: dim,
  borderRadius: 10,
}).theme(({ isActive }, theme) => ({
  boxShadow: isActive ? [[0, 0, 0, 2, theme.backgroundStrongest]] : null,
}))

const allApps = [
  {
    title: 'Search',
    icon: require('../assets/appicon-search.svg'),
    description:
      'The Search App comes with Orbit, works with all data apps and lets you search across them all in a unified interface.',
  },
  {
    title: 'Lists',
    icon: require('../assets/appicon-lists.svg'),
    description:
      'The Lists App comes with Orbit, it lets you create lists of any content within Orbit, including any data from a Data App.',
  },
  {
    title: 'People',
    icon: require('../assets/appicon-people.svg'),
    description: `The People App looks for any Bit inside Orbit of type Person, and displays it in a unified app. It's a great company-CRM of your teammates.`,
  },
  ...apps,
]

const appElements = allApps.map(app => (
  <Stack
    key={app.title}
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    width={dim}
    height={dim}
    padding={4}
  >
    <Image width={dim * 0.55} height={dim * 0.55} src={app.icon} />
    <Space />
    <SimpleText size={0.9}>{app.title}</SimpleText>
  </Stack>
))
