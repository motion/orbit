import {
  Absolute,
  BorderRight,
  Col,
  gloss,
  List,
  ListItem,
  ListShortcuts,
  Popover,
  Portal,
  RoundButton,
  Row,
  Sidebar,
  SurfacePassProps,
} from '@o/ui'
import { useForceUpdate, useReaction } from '@o/use-store'
import { debounce } from 'lodash'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NotFoundBoundary, View } from 'react-navi'
import StickySidebar from 'sticky-sidebar'

import { useScreenSize } from '../hooks/useScreenSize'
import { usePageTheme } from '../Layout'
import { Navigation } from '../Navigation'
import { recentHMR } from '../SiteRoot'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Key } from '../views/Key'
import { ListSubTitle } from '../views/ListSubTitle'
import { SearchInput } from '../views/SearchInput'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { DocsContents } from './DocsContents'
import { docsItems, docsViews } from './docsItems'
import DocsStart from './DocsPage/DocsStart.mdx'
import { useScreenVal } from './HomePage/SpacedPageContent'
import { NotFoundPage } from './NotFoundPage'

const emptyPromise = () => Promise.resolve({ default: null })

const loadDocsPage = async view => {
  return await Promise.all([
    view.page().then(x => x.default),
    (view.source || emptyPromise)().then(x => x.default),
    (view.examples || emptyPromise)(),
    (view.examplesSource || emptyPromise)().then(x => x.default),
    (view.types || emptyPromise)().then(x => x.default),
  ])
}

export default compose(
  withView(async () => {
    return (
      <DocsPage>
        <View disableScrolling={recentHMR} />
      </DocsPage>
    )
  }),

  mount({
    '/': route({
      title: 'Orbit Documentation',
      view: (
        <DocsContents title="Introduction">
          <DocsStart />
        </DocsContents>
      ),
    }),
    '/:id': route(async req => {
      let id = req.params.id
      const view = docsViews[id]

      if (!view) {
        return {
          view: () => <div>not found</div>,
        }
      }

      const [ChildView, source, examples, examplesSource, types] = await loadDocsPage(view)
      const item = docsItems.all.find(x => x['id'] === id)

      return {
        view: (
          <DocsContents
            id={id}
            title={item ? item['title'] : ''}
            source={source}
            types={types}
            examples={examples}
            examplesSource={examplesSource}
          >
            <ChildView />
          </DocsContents>
        ),
      }
    }),
  }),
)

const docsNavigate = debounce(id => {
  Navigation.navigate(`/docs/${id}`, { replace: true })
}, 150)

const preloadItem = item => {
  return {
    onMouseEnter() {
      if (docsViews[item.id]) {
        loadDocsPage(docsViews[item.id])
      }
    },
  }
}

const DocsPage = memo((props: { children?: any }) => {
  const screen = useScreenSize()
  const siteStore = useSiteStore()
  const [showSidebar, setShowSidebar] = useState(true)
  const [section, setSection] = useState('all')
  const toggleSection = val => setSection(section === val ? 'all' : val)
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)
  const initialPath = window.location.pathname.replace('/docs/', '')
  const initialIndex = initialPath ? docsItems.all.findIndex(x => x['id'] === initialPath) : 1
  const [themeName, setThemeName] = usePageTheme()

  useLayoutEffect(() => {
    if (screen === 'small') {
      return
    }

    const sidebar = new StickySidebar('#sidebar', {
      containerSelector: '#main',
      topSpacing: 0,
      bottomSpacing: 0,
      innerWrapperSelector: '.sidebar__inner',
      stickyClass: 'is-affixed',
      minWidth: 0,
      resizeSensor: true,
    })

    return () => {
      sidebar.destroy()
    }
  }, [screen])

  // hide sidebar on show global sidebar
  useReaction(() => siteStore.showSidebar, show => show && setShowSidebar(false))

  const isSmall = screen === 'small'

  useEffect(() => {
    let sub = Navigation.subscribe(() => {
      inputRef.current.focus()
    })
    return () => {
      sub.unsubscribe()
    }
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

  const sidebarChildren = (
    <React.Fragment key="content">
      <List
        search={search}
        selectable
        alwaysSelected
        defaultSelected={initialIndex}
        overscanCount={500}
        items={docsItems[section]}
        getItemProps={preloadItem}
        onSelect={useCallback(rows => {
          if (!rows[0]) {
            console.warn('no row on select!', rows)
          } else {
            docsNavigate(rows[0].id)
          }
        }, [])}
      />
    </React.Fragment>
  )

  return (
    <>
      <DocsPageHeader
        {...{
          setSearch,
          isSmall,
          inputRef,
          toggleSection,
          section,
          setTheme: setThemeName,
          theme: themeName,
          setShowSidebar,
          siteStore,
          showSidebar,
        }}
      />

      <Portal prepend>
        <Header slim noBorder />
      </Portal>

      {isSmall && (
        <Portal>
          <FixedLayout isSmall={isSmall}>
            <Sidebar
              hidden={!showSidebar}
              zIndex={10000000}
              elevation={25}
              width={280}
              pointerEvents="auto"
              background={theme => theme.background}
            >
              {sidebarChildren}
            </Sidebar>
          </FixedLayout>
        </Portal>
      )}

      <SectionContent fontSize={16} lineHeight={26} fontWeight={300} whiteSpace="normal">
        <Row id="main" className="main">
          {!isSmall && <DocsPageSidebar>{sidebarChildren}</DocsPageSidebar>}
          <Col flex={1} overflow="hidden" padding={isSmall ? 0 : [0, 0, 0, 24]} className="content">
            <NotFoundBoundary render={NotFoundPage}>{props.children}</NotFoundBoundary>
          </Col>
        </Row>

        <BlogFooter />
      </SectionContent>
    </>
  )
})

const DocsPageSidebar = memo(({ children }) => {
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const updateSlow = debounce(forceUpdate, 100)
    window.addEventListener('resize', updateSlow, { passive: true })
    return () => {
      window.removeEventListener('resize', updateSlow)
    }
  })

  return (
    <Col id="sidebar" width={300} pointerEvents="auto" height={window.innerHeight}>
      <Col position="relative" className="sidebar__inner" flex={1}>
        <Col margin={[50, 0, 0]} flex={1} position="relative">
          {children}
          <BorderRight top={10} opacity={0.5} />
        </Col>
      </Col>
    </Col>
  )
})

const DocsPageHeader = memo(
  ({
    setSearch,
    isSmall,
    inputRef,
    toggleSection,
    section,
    setTheme,
    theme,
    setShowSidebar,
    siteStore,
    showSidebar,
  }: any) => {
    return (
      <Portal prepend style={{ position: 'sticky', top: 10, zIndex: 10000000 }}>
        <ListShortcuts>
          <Row
            position="relative"
            margin={[0, 'auto', 0, 'auto']}
            pointerEvents="auto"
            pad={['sm', 0]}
            width={useScreenVal('100%', '90%', '90%')}
            maxWidth={980}
            alignItems="center"
            justifyContent="center"
          >
            <SearchInput
              ref={inputRef}
              onChange={e => setSearch(e.target.value)}
              maxWidth="calc(55% - 20px)"
              flex={1}
              size="xl"
              placeholder={isSmall ? 'Search...' : 'Search the docs...'}
              after={!isSmall && <Key tooltip="Shortcut: t">t</Key>}
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
                zIndex={1000000000000000}
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
              <SurfacePassProps size={1.2} iconSize={12}>
                <Row group>
                  <RoundButton
                    icon="moon"
                    tooltip="Toggle dark mode"
                    onClick={() => setTheme(theme === 'home' ? 'light' : 'home')}
                  />
                  <RoundButton
                    icon="code"
                    iconSize={16}
                    tooltip="Toggle all code collapsed"
                    onClick={siteStore.toggleCodeCollapsed}
                  />
                  {isSmall && (
                    <RoundButton
                      icon={showSidebar ? 'arrowleft' : 'arrowright'}
                      tooltip="Toggle menu"
                      onClick={() => setShowSidebar(!showSidebar)}
                    />
                  )}
                </Row>
              </SurfacePassProps>
            </Absolute>
          </Row>
        </ListShortcuts>
      </Portal>
    )
  },
)

DocsPage.theme = 'home'

const FixedLayout = gloss({
  position: 'fixed',
  top: 120,
  left: 0,
  bottom: 0,
  width: '100%',
  zIndex: 100000,

  isSmall: {
    top: 0,
    zIndex: 100000000,
  },
})

export const MetaSection = gloss({
  margin: 0,
})
