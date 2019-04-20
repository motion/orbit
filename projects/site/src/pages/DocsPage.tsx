import {
  Absolute,
  BorderRight,
  Button,
  Col,
  gloss,
  Input,
  List,
  ListItem,
  Popover,
  Portal,
  RoundButton,
  Row,
  SegmentedRow,
  Sidebar,
  SurfacePassProps,
} from '@o/ui'
import { debounce } from 'lodash'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useEffect, useRef, useState } from 'react'
import { NotFoundBoundary, View } from 'react-navi'

import { useScreenSize } from '../hooks/useScreenSize'
import { Navigation } from '../SiteRoot'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { ListSubTitle } from '../views/ListSubTitle'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { DocsContents } from './DocsContents'
import { docsItems } from './docsItems'
import DocsInstall from './DocsPage/DocsInstall.mdx'
import { NotFoundPage } from './NotFoundPage'

const views = {
  install: {
    page: () => import('./DocsPage/DocsInstall.mdx'),
  },
  start: {
    page: () => import('./DocsPage/DocsStart.mdx'),
  },
  buttons: {
    page: () => import('./DocsPage/DocsButtons.mdx'),
    source: () => import('!raw-loader!@o/ui/src/buttons/Button'),
    types: () => import('../../tmp/Button.json'),
  },
  cards: {
    page: () => import('./DocsPage/DocsCards.mdx'),
    source: () => import('!raw-loader!@o/ui/src/Card'),
    types: () => import('../../tmp/Card.json'),
  },
  progress: {
    page: () => import('./DocsPage/DocsProgress.mdx'),
    source: () => import('!raw-loader!@o/ui/src/progress/Progress'),
    types: () => import('../../tmp/Progress.json'),
  },
  lists: {
    page: () => import('./DocsPage/DocsLists.mdx'),
    source: () => import('!raw-loader!@o/ui/src/lists/List'),
    types: () => import('../../tmp/List.json'),
  },
  tables: {
    page: () => import('./DocsPage/DocsTables.mdx'),
    source: () => import('!raw-loader!@o/ui/src/tables/Table'),
    types: () => import('../../tmp/Table.json'),
  },
}

const emptyPromise = () => Promise.resolve({ default: null })

export default compose(
  withView(async () => {
    return (
      <DocsPage>
        <View />
      </DocsPage>
    )
  }),

  mount({
    '/': route({
      title: 'Orbit Documentation',
      view: (
        <DocsContents title="Introduction">
          <DocsInstall />
        </DocsContents>
      ),
    }),
    '/:id': route(async req => {
      let id = req.params.id
      const view = views[id]

      if (!view) {
        return {
          view: () => <div>not found</div>,
        }
      }

      const [ChildView, source, types] = await Promise.all([
        view.page().then(x => x.default),
        (view.source || emptyPromise)().then(x => x.default),
        (view.types || emptyPromise)().then(x => x.default),
      ])

      const item = docsItems.all.find(x => x['id'] === id)

      return {
        view: (
          <DocsContents title={item ? item['title'] : ''} source={source} types={types}>
            <ChildView />
          </DocsContents>
        ),
      }
    }),
  }),
)

const docsNavigate = debounce(id => Navigation.navigate(`/docs/${id}`), 150)

const DocsPage = memo((props: { children?: any }) => {
  const screen = useScreenSize()
  const siteStore = useSiteStore()
  const [showSidebar, setShowSidebar] = useState(true)
  const [section, setSection] = useState('all')
  const toggleSection = val => setSection(section === val ? 'all' : val)
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  const isSmall = screen === 'small'

  console.log('rendering docspage')

  useEffect(() => {
    console.log('mounting docspage')
  }, [])

  useEffect(() => {
    const keyPress = e => {
      // console.log('e', e.keyCode)
      switch (e.keyCode) {
        case 84: // t
          inputRef.current.focus()
          break
      }
    }
    window.addEventListener('keydown', keyPress)
    return () => {
      window.removeEventListener('keydown', keyPress)
    }
  }, [])

  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [inputRef.current])

  const content = (
    <React.Fragment key="content">
      <List
        search={search}
        selectable
        alwaysSelected
        defaultSelected={1}
        overscanCount={500}
        items={docsItems[section]}
        onSelect={rows => {
          docsNavigate(rows[0].id)
        }}
      />
    </React.Fragment>
  )

  return (
    <MDX>
      <Portal prepend style={{ position: 'sticky', top: 10, zIndex: 10000000 }}>
        <Row
          position="relative"
          margin={[0, 'auto']}
          pointerEvents="auto"
          pad={['sm', 0]}
          width="90%"
          maxWidth={980}
          alignItems="center"
          justifyContent="center"
        >
          <Input
            ref={inputRef}
            onChange={e => setSearch(e.target.value)}
            sizeRadius={10}
            size="xl"
            iconSize={16}
            maxWidth="calc(60% - 20px)"
            flex={1}
            icon="search"
            placeholder={isSmall ? 'Search...' : 'Search the docs...'}
            elevation={3}
            after={
              !isSmall && (
                <Button tooltip="Shortcut: t" size="sm" alt="flat" fontWeight={600}>
                  t
                </Button>
              )
            }
          />

          <Absolute
            top={0}
            width="18%"
            left={0}
            bottom={0}
            alignItems="flex-end"
            justifyContent="center"
          >
            <Popover
              background
              width={300}
              openOnClick
              closeOnClickAway
              elevation={100}
              zIndex={100000000000000000}
              target={<RoundButton icon="filter">{isSmall ? '' : 'Filter'}</RoundButton>}
            >
              <>
                <ListItem selectable={false}>
                  <ListSubTitle marginTop={6}>Sections</ListSubTitle>
                </ListItem>
                <ListItem
                  index={2}
                  title="Docs"
                  alt={section === 'docs' ? 'selected' : null}
                  onClick={() => toggleSection('docs')}
                />
                <ListItem
                  index={2}
                  title="APIs"
                  alt={section === 'apis' ? 'selected' : null}
                  onClick={() => toggleSection('apis')}
                />
                <ListItem
                  index={2}
                  title="Kit"
                  alt={section === 'kit' ? 'selected' : null}
                  onClick={() => toggleSection('kit')}
                />
              </>
            </Popover>
          </Absolute>

          <Absolute
            width="18%"
            top={0}
            right={0}
            bottom={0}
            alignItems="center"
            justifyContent="flex-start"
            flexFlow="row"
          >
            <SurfacePassProps circular iconSize={12}>
              <SegmentedRow>
                <RoundButton
                  icon="moon"
                  tooltip="Toggle dark mode"
                  onClick={() => siteStore.setTheme(siteStore.theme === 'home' ? 'light' : 'home')}
                />
                {isSmall && (
                  <RoundButton
                    icon="panel-stats"
                    tooltip="Toggle menu"
                    onClick={() => setShowSidebar(!showSidebar)}
                  />
                )}
              </SegmentedRow>
            </SurfacePassProps>
          </Absolute>
        </Row>
      </Portal>
      <Portal prepend>
        <Header slim />
      </Portal>
      <Portal>
        <FixedLayout className="mini-scrollbars">
          {isSmall ? (
            <Sidebar
              hidden={!showSidebar}
              zIndex={10000000}
              elevation={5}
              pointerEvents="auto"
              // @ts-ignore
              background={theme => theme.background}
            >
              {content}
            </Sidebar>
          ) : (
            <SectionContent pointerEvents="none" flex={1}>
              <Col position="relative" flex={1} width={300} pointerEvents="auto">
                {content}
                <BorderRight opacity={0.5} />
              </Col>
            </SectionContent>
          )}
        </FixedLayout>
      </Portal>

      <SectionContent fontSize={16} lineHeight={26}>
        <ContentPosition isSmall={isSmall}>
          <NotFoundBoundary render={NotFoundPage}>{props.children}</NotFoundBoundary>
          <BlogFooter />
        </ContentPosition>
      </SectionContent>
    </MDX>
  )
})

DocsPage.theme = 'dark'

const ContentPosition = gloss<{ isSmall?: boolean }>({
  width: '100%',
  padding: [0, 0, 0, 300],
  isSmall: {
    padding: [0, 0, 0, 0],
  },
})

const FixedLayout = gloss({
  position: 'fixed',
  top: 120,
  left: 0,
  bottom: 0,
  width: '100%',
  zIndex: 100000,
})

export const MetaSection = gloss({
  margin: [-30, -30, 0],
})
