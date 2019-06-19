import { BorderRight, Button, Col, gloss, List, Portal, Row, Sidebar, Space } from '@o/ui'
import { createStoreContext, useForceUpdate, useReaction } from '@o/use-store'
import { debounce } from 'lodash'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { NotFoundBoundary, View } from 'react-navi'

import { Header } from '../Header'
import { useScreenSize } from '../hooks/useScreenSize'
import { usePageTheme } from '../Layout'
import { linkProps } from '../LinkState'
import { Navigation } from '../Navigation'
import { useSiteStore } from '../SiteStore'
import { ContentSection } from '../views/ContentSection'
import { FadeChild, useFadePage } from '../views/FadeIn'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { DocsContents } from './DocsContents'
import { docsItems, docsViews } from './docsItems'
import DocsStart from './DocsPage/DocsStart.mdx'
import { Example } from './DocsPage/Example'
import { DocsPageHeader } from './DocsPageHeader'
import { docsNavigate, loadDocsPage, navTm, preloadItem } from './docsPageHelpers'
import { NotFoundPage } from './NotFoundPage'
import { useStickySidebar } from './useStickySidebar'

const getInitialIndex = () => {
  const initialPath = window.location.pathname.replace('/docs/', '')
  return initialPath ? docsItems.all.findIndex(x => x['id'] === initialPath) : 1
}

class DocsStore {
  initialIndex = getInitialIndex()
  search = ''
  section = 'all'

  setSearch = next => {
    this.search = next
    this.initialIndex = 0
  }

  setSection = next => {
    this.section = next
  }

  toggleSection = val => this.setSection(this.section === val ? 'all' : val)
}

export const DocsStoreContext = createStoreContext(DocsStore)

const itemProps = {
  hideBorder: true,
  iconProps: {
    opacity: 0.65,
  },
}

const DocsList = memo(() => {
  const docsStore = DocsStoreContext.useStore()
  return (
    <List
      query={docsStore.search}
      selectable
      alwaysSelected
      defaultSelected={docsStore.initialIndex}
      overscanCount={500}
      items={docsItems[docsStore.section]}
      itemProps={itemProps}
      getItemProps={preloadItem}
      onSelect={useCallback(rows => {
        if (!rows[0]) {
          console.warn('no row on select!', rows)
        } else {
          console.log('docsNavigate', rows[0])
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
  const [showSidebar, setShowSidebar] = useState(true)
  const inputRef = useRef(null)
  const [themeName, setThemeName] = usePageTheme()

  useStickySidebar({
    condition: screen !== 'small',
    id: '#sidebar',
    containerSelector: '#main',
  })

  // hide sidebar on show global sidebar
  useReaction(() => siteStore.showSidebar, show => show && setShowSidebar(false))

  const isSmall = screen === 'small'

  useEffect(() => {
    let sub = Navigation.subscribe(() => {
      clearTimeout(navTm)

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
      <FadeChild style={{ flex: 1 }}>
        <DocsList />
      </FadeChild>
    </React.Fragment>
  )

  return (
    <DocsStoreContext.Provider>
      <Fade.FadeProvide>
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

        <Portal prepend>
          <Header slim noBorder />
        </Portal>

        {isSmall && (
          <Portal>
            <FixedLayout isSmall>
              <Sidebar
                hidden={!showSidebar}
                zIndex={10000000}
                elevation={25}
                width={260}
                pointerEvents="auto"
                background={theme => theme.background}
              >
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
                ref={Fade.ref}
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
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const updateSlow = debounce(forceUpdate, 100)
    window.addEventListener('resize', updateSlow, { passive: true })
    return () => {
      window.removeEventListener('resize', updateSlow)
    }
  })

  return (
    <Col id="sidebar" width={250} pointerEvents="auto" height={window.innerHeight}>
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
      <DocsPage>
        <View disableScrolling={window['recentHMR']} />
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
      <Row pad>
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
      {children}
    </>
  )
}
