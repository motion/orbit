import { Button, configureHotKeys, Contents, gloss, Portal, ProvideBanner, Sidebar, Space, Stack, Theme, View } from '@o/ui'
import { useReaction } from '@o/use-store'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useEffect, useRef, useState } from 'react'
import { NotFoundBoundary, View as NaviView } from 'react-navi'

import { Header } from '../Header'
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
import { DocsList } from './DocsList'
import DocsStart from './DocsPage/DocsStart.mdx'
import { Example } from './DocsPage/Example'
import { ResizeSensor } from './DocsPage/ResizeSensor'
import { DocsPageHeader } from './DocsPageHeader'
import { loadDocsPage } from './docsPageHelpers'
import { DocsPageSidebar } from './DocsPageSidebar'
import { DocsStoreContext } from './DocsStore'
import { NotFoundPage } from './NotFoundPage'

window['ResizeSensor'] = ResizeSensor

export default compose(
  withView(async () => {
    if (window.location.pathname.indexOf('/isolate') >= 0) {
      return (
        <Theme name="light">
          <DocsChromeSimple>
            <NaviView />
          </DocsChromeSimple>
        </Theme>
      )
    }
    return (
      <ProvideBanner>
        <DocsPageFrame>
          <DocsPage>
            <NaviView disableScrolling={window['recentHMR']} />
          </DocsPage>
        </DocsPageFrame>
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

configureHotKeys({
  ignoreTags: [],
})

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

const DocsPageFrame = props => {
  const Fade = useFadePage({
    threshold: 0,
  })
  return (
    <Fade.FadeProvide>
      <Contents nodeRef={Fade.ref}>
        <DocsPage {...props} />
      </Contents>
    </Fade.FadeProvide>
  )
}

const DocsPage = memo((props: any) => {
  const siteStore = useSiteStore()
  return null
  const [showSidebar, setShowSidebar] = useState(false)
  const inputRef = useRef(null)
  const [themeName, setThemeName] = usePageTheme()

  // hide sidebar on show global sidebar
  useReaction(() => siteStore.showSidebar, show => show && setShowSidebar(false))

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
      console.log('e', e.keyCode)
      switch (e.keyCode) {
        case 191: {
          if (
            document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA'
          ) {
            // dont steal focus, meanie
            return
          }
          if (document.activeElement === inputRef.current) {
            // dont focus if already focused
            return
          }
          setTimeout(() => {
            const el = inputRef.current
            el.focus()
            el.setSelectionRange(0, el.value.length)
          })
          break
        }
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
          <Theme name="home">
            <DocsPageHeader
              {...{
                inputRef,
                setTheme: setThemeName,
                theme: themeName,
                setShowSidebar,
                siteStore,
                showSidebar,
              }}
            />
          </Theme>
        </Portal>

        <Portal prepend>
          <Theme name="home">
            <Header
              slim
              noBorder
              before={
                <>
                  <Button
                    abovesm-display="none"
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
                </>
              }
            />
          </Theme>
        </Portal>

        <FloatingDocsSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <Theme name={themeName}>
          <main className="main-contents">
            <SectionContent background={theme => theme.background} maxWidth={1400}>
              <Stack direction="horizontal" id="main" className="main">
                <DocsPageSidebar sm-display="none">
                  <FadeInView data-is="DocsPageSidebar" flex={1} pointerEvents="auto">
                    <DocsList shouldRenderAll />
                  </FadeInView>
                </DocsPageSidebar>
                <Stack
                  nodeRef={Fade.ref}
                  flex={1}
                  overflow="hidden"
                  className="content"
                  sm-padding={0}
                  padding={[0, 0, 0, 24]}
                >
                  <ContentSection>
                    <NotFoundBoundary render={NotFoundPage}>{props.children}</NotFoundBoundary>
                  </ContentSection>
                </Stack>
              </Stack>

              <Space size={250} />

              <BlogFooter />
            </SectionContent>
          </main>
        </Theme>
      </Fade.FadeProvide>
    </DocsStoreContext.Provider>
  )
})

// @ts-ignore
DocsPage.theme = 'docsPageTheme'

const FloatingDocsSidebar = ({ showSidebar, setShowSidebar }: any) => {
  const [themeName] = usePageTheme()
  return (
    <Portal>
      <Theme name={themeName}>
        <FixedLayout isSmall>
          <Sidebar
            hidden={!showSidebar}
            zIndex={10000000}
            elevation={25}
            width={260}
            data-is="SmallSidebar"
            background={theme => theme.background}
          >
            <View flex={1} pointerEvents="auto">
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
              <DocsList />
            </View>
          </Sidebar>
        </FixedLayout>
      </Theme>
    </Portal>
  )
}

function DocsChromeSimple({ children }) {
  return (
    <View minHeight="100vh" background={theme => theme.background}>
      <Header slim noBorder />
      <Stack direction="horizontal" padding>
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
      </Stack>
      <Stack padding>{children}</Stack>
    </View>
  )
}
