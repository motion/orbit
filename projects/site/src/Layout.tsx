import { Button, ErrorBoundary, FullScreen, Portal, ProvideUI, Theme, Title, View } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { isDefined } from '@o/utils'
import { throttle } from 'lodash'
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { NotFoundBoundary, useCurrentRoute, useLoadingRoute } from 'react-navi'

import { scrollTo } from './etc/helpers'
import { Header } from './Header'
import { useScreenSize } from './hooks/useScreenSize'
import { useSiteStore } from './SiteStore'
import { themes } from './themes'
import { BusyIndicator } from './views/BusyIndicator'
import { useFadePage } from './views/FadeIn'
import { HeaderLink, LinksLeft, LinksRight } from './views/HeaderLink'

const transition = 'transform ease 300ms'

let updateLayout = null

export const usePageTheme = () => {
  const forceUpdate = useForceUpdate()
  const route = useCurrentRoute()
  const curView = route.views.find(x => x.type && x.type.theme)
  const key = `theme-${route.url.pathname.split('/')[1] || ''}`
  const theme = localStorage.getItem(key) || (curView && curView.type.theme) || 'home'
  return [
    theme,
    useCallback(
      next => {
        localStorage.setItem(key, next)
        forceUpdate()
        updateLayout()
      },
      [key],
    ),
  ]
}

const PageLoading = () => {
  const loadingRoute = useLoadingRoute()
  return <BusyIndicator color="#FE5C58" isBusy={!!loadingRoute} delayMs={50} />
}

export const Layout = memo((props: any) => {
  const forceUpdate = useForceUpdate()
  updateLayout = forceUpdate
  const siteStore = useSiteStore()
  const screen = useScreenSize()
  const sidebarWidth = 300
  const route = useCurrentRoute()
  const [theme] = usePageTheme()

  useEffect(() => {
    siteStore.screenSize = screen
  }, [screen])

  useEffect(() => {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        scrollTo(window.location.hash)
      }
    }
  }, [route])

  useEffect(() => {
    window.addEventListener(
      'resize',
      throttle(() => {
        siteStore.windowHeight = window.innerHeight
      }, 64),
    )
  }, [])

  const maxHeight = siteStore.showSidebar ? window.innerHeight : siteStore.maxHeight

  useLayoutEffect(() => {
    document.body.style.background = themes[theme].background.toCSS()
  }, [theme])

  return (
    <ProvideUI themes={themes} activeTheme={theme}>
      <PageLoading />
      <PeekHeader isActive={route.views.some(x => x.type && x.type.showPeekHeader)} />
      <View
        className={`theme-${theme}`}
        minHeight="100vh"
        minWidth="100vw"
        overflow={isDefined(maxHeight) ? 'hidden' : 'visible'}
        transition={transition}
        style={{
          maxHeight,
          transform: `translateX(${siteStore.showSidebar ? -sidebarWidth : 'none'})`,
        }}
      >
        <ErrorBoundary name="Site Error">
          <NotFoundBoundary render={NotFound}>{props.children}</NotFoundBoundary>
        </ErrorBoundary>
      </View>
      <LayoutSidebar />
    </ProvideUI>
  )
})

const LayoutSidebar = memo(() => {
  const siteStore = useSiteStore()
  const sidebarWidth = 300
  const Fade = useFadePage()

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
    <Portal prepend style={{ zIndex: 100000000 }}>
      <Theme name="home">
        <View
          ref={Fade.ref}
          pointerEvents="auto"
          position="fixed"
          top={0}
          right={0}
          height="100vh"
          transition={transition}
          background={bg}
          style={{
            width: sidebarWidth,
            transform: `translateX(${siteStore.showSidebar ? 0 : sidebarWidth})`,
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
          <Fade.FadeProvide>
            <HeaderLink href="/" {...linkProps}>
              Home
            </HeaderLink>
            <LinksLeft {...linkProps} />
            <LinksRight {...linkProps} />
          </Fade.FadeProvide>
        </View>
      </Theme>
    </Portal>
  )
})

const bg = theme => theme.background

function NotFound() {
  return (
    <View>
      <Title>Not found</Title>
    </View>
  )
}

const PeekHeader = memo((props: { isActive?: boolean }) => {
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

    window.addEventListener('scroll', onScroll, { passive: true })

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
})
