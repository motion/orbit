import { FullScreen, Theme, Title, View } from '@o/ui'
import { createStoreContext } from '@o/use-store'
import { throttle } from 'lodash'
import React, { useEffect, useState } from 'react'
import BusyIndicator from 'react-busy-indicator'
import { NotFoundBoundary, useLoadingRoute } from 'react-navi'
import { useScreenSize } from './hooks/useScreenSize'
import { getPageForPath, Navigation } from './SiteRoot'
import { Header, HeaderLink, LinksLeft, LinksRight } from './views/Header'

class SiteStore {
  theme = null
  screenSize = 'large'
  maxHeight = null
  showSidebar = false

  windowHeight = window.innerHeight

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar
  }

  setTheme = (name: string) => {
    this.theme = name
  }

  setMaxHeight = (val: any) => {
    this.maxHeight = val
  }

  get sectionHeight() {
    let maxHeight = 1050
    let desiredHeight = this.windowHeight
    // taller on mobile
    if (this.screenSize === 'small') {
      desiredHeight = this.windowHeight
      maxHeight = 950
    }
    return Math.max(
      // min-height
      850,
      Math.min(
        desiredHeight,
        // max-height
        maxHeight,
      ),
    )
  }
}

const { SimpleProvider, useStore, useCreateStore } = createStoreContext(SiteStore)

export const useSiteStore = useStore

const transition = 'transform ease 300ms'

export function Layout(props: any) {
  const loadingRoute = useLoadingRoute()
  const siteStore = useCreateStore()
  const screen = useScreenSize()
  const sidebarWidth = 300

  window['SiteStore'] = siteStore

  useEffect(() => {
    siteStore.screenSize = screen
  }, [screen])

  useEffect(() => {
    async function updatePath() {
      const page = await getPageForPath()
      if (page && page.theme) {
        siteStore.setTheme(page.theme)
      }
    }

    Navigation.subscribe(updatePath)
    updatePath()
  }, [])

  useEffect(() => {
    window.addEventListener(
      'resize',
      throttle(() => {
        siteStore.windowHeight = window.innerHeight
      }, 64),
    )
  }, [])

  if (!siteStore.theme) {
    return null
  }

  const linkProps = {
    width: '100%',
    padding: 20,
    fontSize: 22,
    textAlign: 'left',
    onMouseUp: () => {
      siteStore.toggleSidebar()
    },
  }

  return (
    <Theme name={siteStore.theme}>
      <SimpleProvider value={siteStore}>
        <PeekHeader />
        <View
          minHeight="100vh"
          minWidth="100vw"
          maxHeight={siteStore.showSidebar ? window.innerHeight : siteStore.maxHeight}
          overflow="hidden"
          transition={transition}
          transform={{
            x: siteStore.showSidebar ? -sidebarWidth : 0,
          }}
          background={bg}
        >
          <NotFoundBoundary render={NotFound}>
            <BusyIndicator isBusy={!!loadingRoute} delayMs={50} />
            {props.children}
          </NotFoundBoundary>
        </View>
        <View
          position="fixed"
          top={0}
          right={0}
          width={sidebarWidth}
          height="100vh"
          transition={transition}
          transform={{
            x: siteStore.showSidebar ? 0 : sidebarWidth,
          }}
        >
          <HeaderLink href="/" {...linkProps}>
            Home
          </HeaderLink>
          <LinksLeft {...linkProps} />
          <LinksRight {...linkProps} />
        </View>
      </SimpleProvider>
    </Theme>
  )
}

const bg = theme => theme.background

function NotFound() {
  return (
    <View>
      <Title>Not found</Title>
    </View>
  )
}

function PeekHeader() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.documentElement

    let top = el.scrollTop
    let direction: 'down' | 'up' = 'down'

    const onScroll = throttle(() => {
      const next = el.scrollTop
      direction = next >= top ? 'down' : 'up'

      // avoid small moves
      const diff = direction === 'down' ? next - top : top - next
      if (diff < 150) {
        return
      }

      top = next

      if (direction === 'up' && top > 300) {
        setShow(true)
      } else {
        setShow(false)
      }
    }, 100)

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <Theme name="home">
      <FullScreen
        zIndex={100000000}
        position="fixed"
        bottom="auto"
        transition="all ease 200ms"
        opacity={show ? 1 : 0}
        transform={{ y: show ? 0 : -40 }}
        className="peek-header"
      >
        <Header slim boxShadow={[[0, 0, 30, [0, 0, 0, 1]]]} />
      </FullScreen>
    </Theme>
  )
}
