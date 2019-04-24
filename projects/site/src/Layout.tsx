import { Button, FullScreen, Portal, ProvideUI, Theme, Title, View } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { isDefined } from '@o/utils'
import { throttle } from 'lodash'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import BusyIndicator from 'react-busy-indicator'
import { NotFoundBoundary, useCurrentRoute, useLoadingRoute } from 'react-navi'

import { useScreenSize } from './hooks/useScreenSize'
import { useSiteStore } from './SiteStore'
import { themes } from './themes'
import { Header, HeaderLink, LinksLeft, LinksRight } from './views/Header'

const transition = 'transform ease 300ms'

let updateLayout = null

export const usePageTheme = () => {
  const forceUpdate = useForceUpdate()
  const route = useCurrentRoute()
  const curView = route.views.find(x => x.type && x.type.theme)
  const key = `theme-${route.url.pathname.split('/')[0]}`
  const theme = localStorage.getItem(key) || (curView && curView.type.theme) || 'home'
  return [
    theme,
    useCallback(next => {
      localStorage.setItem(key, next)
      forceUpdate()
      updateLayout()
    }, []),
  ]
}

export function Layout(props: any) {
  const forceUpdate = useForceUpdate()
  updateLayout = forceUpdate
  const loadingRoute = useLoadingRoute()
  const siteStore = useSiteStore()
  const screen = useScreenSize()
  const sidebarWidth = 300
  const route = useCurrentRoute()
  const [theme] = usePageTheme()

  window['SiteStore'] = siteStore

  useEffect(() => {
    siteStore.screenSize = screen
  }, [screen])

  useEffect(() => {
    window.addEventListener(
      'resize',
      throttle(() => {
        siteStore.windowHeight = window.innerHeight
      }, 64),
    )
  }, [])

  const linkProps = {
    width: '100%',
    padding: 20,
    fontSize: 22,
    textAlign: 'left',
    onMouseUp: () => {
      siteStore.toggleSidebar()
    },
  }

  const maxHeight = siteStore.showSidebar ? window.innerHeight : siteStore.maxHeight
  console.log('route', route)

  useLayoutEffect(() => {
    document.body.style.background = themes[theme].background.toCSS()
  }, [theme])

  return (
    <ProvideUI themes={themes}>
      <Theme name={theme}>
        <BusyIndicator isBusy={!!loadingRoute} delayMs={50} />
        <PeekHeader isActive={route.views.some(x => x.type && x.type.showPeekHeader)} />
        <View
          minHeight="100vh"
          minWidth="100vw"
          maxHeight={maxHeight}
          overflow={isDefined(maxHeight) ? 'hidden' : 'visible'}
          transition={transition}
          transform={{
            x: siteStore.showSidebar ? -sidebarWidth : 0,
          }}
          background={bg}
        >
          <NotFoundBoundary render={NotFound}>{props.children}</NotFoundBoundary>
        </View>
        <Portal prepend style={{ zIndex: 100000000 }}>
          <Theme name="home">
            <View
              pointerEvents="auto"
              position="fixed"
              top={0}
              right={0}
              width={sidebarWidth}
              height="100vh"
              transition={transition}
              background={theme => theme.background}
              transform={{
                x: siteStore.showSidebar ? 0 : sidebarWidth,
              }}
            >
              <Button
                position="absolute"
                top={20}
                right={20}
                chromeless
                icon="cross"
                iconSize={16}
                zIndex={1000}
                cursor="pointer"
                onClick={siteStore.toggleSidebar}
              />
              <HeaderLink href="/" {...linkProps}>
                Home
              </HeaderLink>
              <LinksLeft {...linkProps} />
              <LinksRight {...linkProps} />
            </View>
          </Theme>
        </Portal>
      </Theme>
    </ProvideUI>
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

function PeekHeader(props: { isActive?: boolean }) {
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

  if (!props.isActive) {
    return null
  }

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
