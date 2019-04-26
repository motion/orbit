import { gloss, useTheme } from '@o/gloss'
import { BorderBottom, Button, createContextualProps, Row, RowProps, SimpleText, SimpleTextProps, View } from '@o/ui'
import React, { memo, useState } from 'react'
import { useCurrentRoute } from 'react-navi'

import { useScreenSize } from '../hooks/useScreenSize'
import { Navigation, routeTable } from '../Navigation'
import { useScreenVal } from '../pages/HomePage/SpacedPageContent'
import { useSiteStore } from '../SiteStore'
import { defaultConfig, FadeChild, fastConfig, useFadePage } from './FadeIn'
import { LogoHorizontal } from './LogoHorizontal'
import { LogoVertical } from './LogoVertical'
import { SectionContent } from './SectionContent'

const LinkText = gloss(View, {
  userSelect: 'none',
  textAlign: 'center',
  transform: {
    y: 0.5,
  },
  '& a': {
    textDecoration: 'none',
  },
})

const HeaderContext = createContextualProps<{ setShown?: Function; shown?: boolean }>()
let tm = null

export type LinkProps = SimpleTextProps & { href?: string; external?: boolean }
export function Link({
  children,
  fontSize = 16,
  href,
  width,
  margin,
  external,
  ...props
}: LinkProps) {
  const header = HeaderContext.useProps()
  const route = useCurrentRoute()
  const isActive =
    href === '/' ? route.url.pathname === href : route.url.pathname.indexOf(href) === 0

  return (
    <LinkText
      cursor="pointer"
      onClick={() => {
        if (header) {
          header.setShown(false)
        }
        clearTimeout(tm)
        tm = setTimeout(() => {
          Navigation.navigate(href)
        }, 100)
      }}
      fontSize={fontSize}
      width={width}
      margin={margin}
      onMouseEnter={() => {
        // pre load pages on hover
        if (routeTable[href]) {
          routeTable[href]().then(console.log.bind(console))
        }
      }}
    >
      <SimpleText
        fontSize={fontSize}
        alpha={isActive ? 1 : 0.6}
        fontWeight={300}
        fontFamily="GT Eesti"
        hoverStyle={{ alpha: 1 }}
        activeStyle={{ alpha: isActive ? 1 : 0.7 }}
        transition="all ease 300ms"
        {...props}
      >
        {external ? (
          <a
            href={`${href}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              window.open(`${href}`, '_blank')
            }}
          >
            {children}
          </a>
        ) : (
          children
        )}
      </SimpleText>
    </LinkText>
  )
}

export const HeaderLink = ({ delay, children, ...props }: any) => {
  const header = HeaderContext.useProps()
  const leaving = header && header.shown === false
  return (
    <Link width="33%" {...props}>
      <FadeChild delay={leaving ? 0 : delay} config={leaving ? fastConfig : defaultConfig}>
        {children}
      </FadeChild>
    </Link>
  )
}

const linkDelay = 80

export const LinksLeft = props => {
  return (
    <>
      <HeaderLink delay={linkDelay * 0} {...props} href="/docs">
        Start
      </HeaderLink>
      <HeaderLink delay={linkDelay * 1} {...props} href="/docs">
        Docs
      </HeaderLink>
      <HeaderLink delay={linkDelay * 2} {...props} href="/apps">
        Apps
      </HeaderLink>
    </>
  )
}

export const LinksRight = props => (
  <>
    <HeaderLink delay={linkDelay * 4} {...props} href="/beta">
      Beta
    </HeaderLink>
    <HeaderLink delay={linkDelay * 5} {...props} href="/blog">
      Blog
    </HeaderLink>
    <HeaderLink delay={linkDelay * 6} {...props} href="/about">
      About
    </HeaderLink>
  </>
)

const LinkRow = gloss({
  flexFlow: 'row',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000000,
  position: 'relative',
})

export const Header = memo(
  ({ slim, noBorder, ...rest }: { slim?: boolean; noBorder?: boolean } & RowProps) => {
    const size = useScreenSize()
    const theme = useTheme()
    const siteStore = useSiteStore()
    const [shown, setShown] = useState(true)
    const Fade = useFadePage({ shown })

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

    if (slim) {
      children = (
        <Fade.FadeProvide>
          <Row
            ref={Fade.ref}
            pointerEvents="auto"
            background={theme.background.lighten(0.3)}
            position="relative"
            zIndex={1000000}
            {...rest}
          >
            <HeaderContain height={50}>
              <LinkSection alignRight>{before}</LinkSection>
              <FadeChild config={shown ? defaultConfig : fastConfig} delay={shown ? 400 : 0}>
                <LogoHorizontal slim />
              </FadeChild>
              <LinkSection>{after}</LinkSection>
            </HeaderContain>
            {theme.background.isLight() && !noBorder ? <BorderBottom opacity={0.5} /> : null}
          </Row>
        </Fade.FadeProvide>
      )
    } else {
      children = (
        <Fade.FadeProvide>
          {size === 'small' && (
            <Button
              position="fixed"
              top={10}
              right={10}
              color="#fff"
              zIndex={1000000000}
              hoverStyle={{
                color: '#fff',
              }}
              icon="menu"
              iconSize={16}
              size={2}
              chromeless
              onClick={siteStore.toggleSidebar}
            />
          )}
          <Row
            ref={Fade.ref}
            position="absolute"
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
              <FadeChild config={shown ? defaultConfig : fastConfig} delay={shown ? 100 : 0}>
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

export const HeaderContain = props => {
  return (
    <SectionContent
      padding={[0, useScreenVal('0%', '2%', '10%')]}
      flexFlow="row"
      alignItems="center"
      justifyContent="space-around"
      {...props}
    />
  )
}

export const LinkSection = gloss({
  flex: 4,
  flexFlow: 'row',
  justifyContent: 'space-between',
  maxWidth: 380,
  alignItems: 'center',

  padding: [0, '3%', 0, '1%'],

  alignRight: {
    padding: [0, '1%', 0, '3%'],
  },
})
