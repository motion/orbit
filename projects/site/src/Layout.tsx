import { BorderBottom, Button, ErrorBoundary, FullScreen, Portal, ProvideUI, Row, RowProps, Theme, Title, View } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { isDefined } from '@o/utils'
import { Box, gloss, useTheme } from 'gloss'
import { throttle } from 'lodash'
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { NotFoundBoundary, useCurrentRoute, useLoadingRoute } from 'react-navi'

import { scrollTo } from './etc/helpers'
import { useIsTiny, useScreenSize } from './hooks/useScreenSize'
import { LinkState } from './LinkState'
import { useSiteStore } from './SiteStore'
import { themes } from './themes'
import { BusyIndicator } from './views/BusyIndicator'
import { defaultConfig, FadeChild, fastStatticConfig, useFadePage } from './views/FadeIn'
import { HeaderContain, LinkSection } from './views/HeaderContain'
import { HeaderContext } from './views/HeaderContext'
import { HeaderLink, LinksLeft, LinksRight } from './views/HeaderLink'
import { LogoHorizontal } from './views/LogoHorizontal'
import { LogoVertical } from './views/LogoVertical'

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
    <ProvideUI themes={themes} activeTheme="light">
      <PageLoading />
      <PeekHeader isActive={route.views.some(x => x.type && x.type.showPeekHeader)} />
      <View
        className={`theme-${theme}`}
        minHeight="100vh"
        minWidth="100vw"
        maxHeight={maxHeight}
        overflow={isDefined(maxHeight) ? 'hidden' : 'visible'}
        transition={transition}
        transform={{
          x: siteStore.showSidebar ? -sidebarWidth : 'none',
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
          width={sidebarWidth}
          height="100vh"
          transition={transition}
          background={bg}
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
const LinkRow = gloss(Box, {
  flexFlow: 'row',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  position: 'relative',
})

export const Header = memo(
  ({ slim, noBorder, ...rest }: { slim?: boolean; noBorder?: boolean } & RowProps) => {
    const isTiny = useIsTiny()
    const size = useScreenSize()
    const theme = useTheme()
    const siteStore = useSiteStore()
    const [shown, setShown] = useState(true)
    const Fade = useFadePage({ shown, threshold: 0 })

    let before = null
    let after = null

    if (size !== 'small') {
      before = (
        <LinkRow>
          <LinksLeft />
        </LinkRow>
      )
      after = (
        <LinkRow>
          <LinksRight />
        </LinkRow>
      )
    }

    let children
    const menuElement = size === 'small' && (
      <Button
        position="fixed"
        top={3}
        right={10}
        zIndex={1000000000}
        icon="menu"
        iconSize={16}
        size={2}
        chromeless
        onClick={siteStore.toggleSidebar}
      />
    )

    if (slim) {
      children = (
        <Fade.FadeProvide>
          {menuElement}
          <Row
            ref={Fade.ref}
            pointerEvents="auto"
            background={theme.background.lighten(0.05)}
            position="relative"
            zIndex={1000000}
            {...rest}
          >
            <HeaderContain height={50}>
              <LinkSection alignRight>{before}</LinkSection>
              <FadeChild
                off={!LinkState.didAnimateOut}
                config={shown ? defaultConfig : fastStatticConfig}
                delay={shown ? 0 : 0}
              >
                <LogoHorizontal slim />
              </FadeChild>
              <LinkSection>{after}</LinkSection>
            </HeaderContain>
            {!noBorder && <BorderBottom opacity={0.5} />}
          </Row>
        </Fade.FadeProvide>
      )
    } else {
      children = (
        <Fade.FadeProvide>
          {menuElement}
          <Row
            ref={Fade.ref}
            position={isTiny ? 'relative' : 'absolute'}
            top={0}
            left={0}
            right={0}
            zIndex={1000000}
            alignItems="center"
            justifyContent="space-around"
            padding={[30, 0]}
            {...rest}
          >
            <HeaderContain>
              <LinkSection alignRight>{before}</LinkSection>
              <FadeChild
                off={!LinkState.didAnimateOut}
                config={shown ? defaultConfig : fastStatticConfig}
                delay={shown ? 100 : 0}
              >
                <LogoVertical />
              </FadeChild>
              <LinkSection>{after}</LinkSection>
            </HeaderContain>
          </Row>
        </Fade.FadeProvide>
      )
    }

    return (
      <HeaderContext.PassProps setShown={setShown} shown={shown}>
        {children}
      </HeaderContext.PassProps>
    )
  },
)
