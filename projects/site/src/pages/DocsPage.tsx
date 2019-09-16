import { BorderRight, Button, Col, configureHotKeys, gloss, List, ListItemProps, Portal, ProvideBanner, Row, Sidebar, sleep, Space, useFilter, useOnMount, whenIdle } from '@o/ui'
import { useReaction } from '@o/use-store'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NotFoundBoundary, View } from 'react-navi'

import { Header } from '../Header'
import { useScreenSize } from '../hooks/useScreenSize'
import { usePageTheme } from '../Layout'
import { Navigation } from '../Navigation'
import { useSiteStore } from '../SiteStore'
import { linkProps } from '../useLink'
import { ContentSection } from '../views/ContentSection'
import { FadeInView, useFadePage } from '../views/FadeInView'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { DocsContents } from './DocsContents'
import { docsItems, docsViews } from './docsItems'
import DocsStart from './DocsPage/DocsStart.mdx'
import { Example } from './DocsPage/Example'
import { ResizeSensor } from './DocsPage/ResizeSensor'
import { DocsPageHeader } from './DocsPageHeader'
import { docsNavigate, loadDocsPage, preloadItem } from './docsPageHelpers'
import { DocsStoreContext } from './DocsStore'
import { NotFoundPage } from './NotFoundPage'
import { useStickySidebar } from './useStickySidebar'

window['ResizeSensor'] = ResizeSensor

const itemProps = {
  hideBorder: true,
  iconProps: {
    opacity: 0.65,
  },
}

configureHotKeys({
  ignoreTags: [],
})

const DocsList = memo(() => {
  const docsStore = DocsStoreContext.useStore()
  const [mounted, setMounted] = useState(false)

  useOnMount(async () => {
    await whenIdle()
    await sleep(50)
    await whenIdle()
    await sleep(50)
    await whenIdle()
    await sleep(50)
    await whenIdle()
    console.log('MOUNT')
    setMounted(true)
  })

  const curRow = useRef(docsItems[docsStore.section][0])
  const { results } = useFilter({
    query: docsStore.search,
    items: docsItems[docsStore.section],
  })

  const items = useMemo(() => {
    let items: ListItemProps[] = []
    if (docsStore.search) {
      items = [
        ...items,
        {
          key: docsStore.search,
          groupName: `Current Page`,
          ...curRow.current,
        },
        { separator: `Results for "${docsStore.search}"`, selectable: false },
      ]
    }
    items = [...items, ...results]
    return items
  }, [docsStore.search, results])

  return (
    <List
      selectable
      alwaysSelected
      defaultSelected={docsStore.search ? 0 : docsStore.initialIndex}
      overscanCount={mounted ? 500 : 0}
      items={items}
      itemProps={itemProps}
      getItemProps={preloadItem}
      onSelect={useCallback(rows => {
        if (!rows[0]) {
          console.warn('no row on select!', rows)
        } else {
          console.log('nav to', rows[0].id)
          curRow.current = rows[0]
          docsNavigate(rows[0].id)
        }
      }, [])}
    />
  )
})

const DocsPage = memo((props: { children?: any }) => {
  const Fade = useFadePage({
    threshold: 0,
  })
  const screen = useScreenSize()
  const siteStore = useSiteStore()
  const [showSidebar, setShowSidebar] = useState(false)
  const inputRef = useRef(null)
  const [themeName, setThemeName] = usePageTheme()

  // hide sidebar on show global sidebar
  useReaction(() => siteStore.showSidebar, show => show && setShowSidebar(false))

  const isSmall = screen === 'small'

  useEffect(() => {
    let sub = Navigation.subscribe(() => {
      setShowSidebar(false)
      if (document.activeElement !== inputRef.current) {
        inputRef.current.focus()
      }
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
          if (
            document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA'
          ) {
            // dont steal focus, meanie
            return
          }
          if (document.activeElement !== inputRef.current) {
            // dont focus if already focused
            return
          }
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
      <FadeInView style={{ flex: 1, pointerEvents: 'auto' }}>
        <DocsList />
      </FadeInView>
    </React.Fragment>
  )

  return (
    <DocsStoreContext.Provider>
      <Fade.FadeProvide>
        <Portal
          prepend
          style={{
            position: 'sticky',
            top: 10,
            zIndex: 10000000,
          }}
        >
          <DocsPageHeader
            {...{
              isSmall,
              inputRef,
              setTheme: setThemeName,
              theme: themeName,
              setShowSidebar,
              siteStore,
              showSidebar,
            }}
          />
        </Portal>

        <Portal prepend>
          <Header
            slim
            noBorder
            before={
              <>
                {isSmall && (
                  <Button
                    position="fixed"
                    pointerEvents="auto"
                    icon={showSidebar ? 'arrowleft' : 'arrowright'}
                    tooltip="Toggle menu"
                    top={-3}
                    left={10}
                    zIndex={10000000}
                    iconSize={16}
                    size={2}
                    fontSize={16}
                    chromeless
                    onClick={() => setShowSidebar(!showSidebar)}
                  />
                )}
              </>
            }
          />
        </Portal>

        {isSmall && (
          <Portal>
            <FixedLayout isSmall>
              <Sidebar
                hidden={!showSidebar}
                zIndex={10000000}
                elevation={25}
                width={260}
                background={theme => theme.background}
              >
                <Button
                  chromeless
                  size={1.5}
                  icon="cross"
                  position="absolute"
                  top={0}
                  right={0}
                  onClick={() => setShowSidebar(false)}
                  pointerEvents="auto"
                  zIndex={100}
                  opacity={0.5}
                />
                {sidebarChildren}
              </Sidebar>
            </FixedLayout>
          </Portal>
        )}

        <main className="main-contents">
          <SectionContent>
            <Row id="main" className="main">
              {!isSmall && <DocsPageSidebar>{sidebarChildren}</DocsPageSidebar>}
              <Col
                nodeRef={Fade.ref}
                flex={1}
                overflow="hidden"
                className="content"
                padding={isSmall ? 0 : [0, 0, 0, 24]}
              >
                <ContentSection>
                  <NotFoundBoundary render={NotFoundPage}>{props.children}</NotFoundBoundary>
                </ContentSection>
              </Col>
            </Row>

            <Space size={250} />

            <BlogFooter />
          </SectionContent>
        </main>
      </Fade.FadeProvide>
    </DocsStoreContext.Provider>
  )
})

const DocsPageSidebar = memo(({ children }: any) => {
  const screen = useScreenSize()

  useStickySidebar({
    condition: screen !== 'small',
    id: '#sidebar',
    containerSelector: '#main',
  })

  return (
    <Col id="sidebar" width={250} pointerEvents="auto" height="100vh">
      <Col position="relative" className="sidebar__inner" flex={1}>
        <Col margin={[25, 0, 0]} flex={1} position="relative">
          {children}
          <BorderRight top={10} opacity={0.5} />
        </Col>
      </Col>
    </Col>
  )
})

// @ts-ignore
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

export default compose(
  withView(async () => {
    if (window.location.pathname.indexOf('/isolate') >= 0) {
      return (
        <DocsChromeSimple>
          <View />
        </DocsChromeSimple>
      )
    }
    return (
      <ProvideBanner>
        <DocsPage>
          <View disableScrolling={window['recentHMR']} />
        </DocsPage>
      </ProvideBanner>
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
            beta={item.beta}
          >
            <ChildView />
          </DocsContents>
        ),
      }
    }),
    '/:id/isolate/:subid': route(async req => {
      let id = req.params.id
      const view = docsViews[id]
      if (!view) {
        return {
          view: () => <div>not found</div>,
        }
      }
      const [_, _2, examples, examplesSource] = await loadDocsPage(view)
      return {
        view: (
          <Example
            chromeless
            examples={examples}
            source={examplesSource}
            id={req.params.subid}
            sourceBelow
            pad
          />
        ),
      }
    }),
  }),
)

function DocsChromeSimple({ children }) {
  return (
    <>
      <Header slim noBorder />
      <Row padding>
        <Button
          {...linkProps(
            window.location.pathname
              .split('/')
              .slice(0, 3)
              .join('/'),
          )}
        >
          Back to Docs
        </Button>
      </Row>
      <Col padding>{children}</Col>
    </>
  )
}
