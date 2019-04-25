import { gloss, useTheme } from '@o/gloss'
import { BorderBottom, Button, Row, RowProps, SimpleText, SimpleTextProps, View } from '@o/ui'
import React, { memo } from 'react'
import { Link as RouterLink } from 'react-navi'
import { LinkProps as NaviLinkProps } from 'react-navi/dist/types/Link'

import { useScreenSize } from '../hooks/useScreenSize'
import { Navigation } from '../Navigation'
import { useScreenVal } from '../pages/HomePage/SpacedPageContent'
import { useSiteStore } from '../SiteStore'
import { LogoHorizontal } from './LogoHorizontal'
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

export type LinkProps = Pick<NaviLinkProps, 'href'> & SimpleTextProps & { external?: boolean }
export function Link({
  children,
  fontSize = 15,
  href,
  width,
  margin,
  external,
  ...props
}: LinkProps) {
  return (
    <LinkText
      cursor="pointer"
      onClick={() => Navigation.navigate(href)}
      fontSize={fontSize}
      width={width}
      margin={margin}
    >
      <SimpleText
        fontSize={fontSize}
        alpha={0.6}
        fontWeight={400}
        hoverStyle={{ alpha: 1 }}
        activeStyle={{ alpha: 0.7 }}
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
          <RouterLink href={href}>{children}</RouterLink>
        )}
      </SimpleText>
    </LinkText>
  )
}

export const HeaderLink = props => <Link width="33%" {...props} />

export const LinksLeft = props => {
  return (
    <>
      <HeaderLink {...props} href="/docs">
        Start
      </HeaderLink>
      <HeaderLink {...props} href="/docs">
        Docs
      </HeaderLink>
      <HeaderLink {...props} href="/apps">
        Apps
      </HeaderLink>
    </>
  )
}

export const LinksRight = props => (
  <>
    <HeaderLink {...props} href="/beta">
      Beta
    </HeaderLink>
    <HeaderLink {...props} href="/blog">
      Blog
    </HeaderLink>
    <HeaderLink {...props} href="/about">
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
    } else {
      after = (
        <>
          <View flex={1} />
          <Button
            color="#fff"
            hoverStyle={{
              color: '#fff',
            }}
            icon="menu"
            iconSize={16}
            size={2}
            chromeless
            transform={{
              y: 0,
              x: 18,
            }}
            onClick={siteStore.toggleSidebar}
          />
        </>
      )
    }

    if (slim) {
      return (
        <Row
          pointerEvents="auto"
          background={theme.background.lighten(0.3)}
          position="relative"
          zIndex={1000000}
          {...rest}
        >
          <HeaderContain height={42}>
            <LinkSection alignRight>{before}</LinkSection>
            <LogoHorizontal slim />
            <LinkSection>{after}</LinkSection>
          </HeaderContain>
          {theme.background.isLight() && !noBorder ? <BorderBottom opacity={0.5} /> : null}
        </Row>
      )
    }

    return (
      <Row
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
          <LogoHorizontal />
          <LinkSection>{after}</LinkSection>
        </HeaderContain>
      </Row>
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
