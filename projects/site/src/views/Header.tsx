import { gloss } from '@o/gloss'
import { BorderBottom, Button, Popover, Row, SimpleText, SimpleTextProps, View } from '@o/ui'
import React from 'react'
import { Link as RouterLink } from 'react-navi'
import { useScreenSize } from '../hooks/useScreenSize'
import { Navigation } from '../SiteRoot'
import { LogoHorizontal } from './LogoHorizontal'
import { Overdrive } from './Overdrive'
import { SectionContent } from './SectionContent'

const LinkText = gloss(View, {
  userSelect: 'none',
  width: '33%',
  textAlign: 'center',
  transform: {
    y: 0.5,
  },
  '& a': {
    textDecoration: 'none',
  },
})

type LinkProps = {
  href: string
  navigation?: any
  routeKey?: string
  routeName?: string
  params?: Object
  children?: any
  fontSize?: any
}

export type LinkProps = Pick<LinkProps, 'href'> & SimpleTextProps
export function Link({ children, fontSize = 16, href, ...props }: LinkProps) {
  return (
    <LinkText cursor="pointer" onClick={() => Navigation.navigate(href)} fontSize={fontSize}>
      <SimpleText
        fontSize={fontSize}
        alpha={0.65}
        fontWeight={200}
        hoverStyle={{ alpha: 1 }}
        {...props}
      >
        <RouterLink href={href}>{children}</RouterLink>
      </SimpleText>
    </LinkText>
  )
}

export const LinksLeft = props => (
  <Overdrive id="links-left">
    <LinkRow>
      <Link {...props} href="/">
        Start
      </Link>
      <Link {...props} href="/docs">
        Docs
      </Link>
      <Link {...props} href="/">
        Apps
      </Link>
    </LinkRow>
  </Overdrive>
)

export const LinksRight = props => (
  <Overdrive id="links-right">
    <LinkRow>
      <Link {...props} href="/">
        Beta
      </Link>
      <Link {...props} href="/">
        Blog
      </Link>
      <Link {...props} href="/">
        About
      </Link>
    </LinkRow>
  </Overdrive>
)

const LinkRow = gloss({
  flexFlow: 'row',
  flex: 1,
  alignItems: 'center',
  zIndex: 1000000000,
  position: 'relative',
})

export function Header({ slim }: { slim?: boolean }) {
  const size = useScreenSize()

  let before = null
  let after = null

  if (size !== 'small') {
    before = <LinksLeft />
    after = <LinksRight />
  } else {
    after = (
      <>
        <View flex={1} />
        <Popover openOnClick closeOnClickAway target={<Button icon="menu" size={1.2} chromeless />}>
          <LinksLeft />
          <LinksRight />
        </Popover>
      </>
    )
  }

  if (slim) {
    return (
      <Row background={theme => theme.background} position="relative">
        <HeaderContain height={32}>
          <LinkSection alignRight>{before}</LinkSection>
          <LogoHorizontal />
          <LinkSection>{after}</LinkSection>
        </HeaderContain>
        <BorderBottom />
      </Row>
    )
  }

  return (
    <Row
      position="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={100000}
      alignItems="center"
      justifyContent="space-around"
      padding={['3.5vh', 0]}
    >
      <HeaderContain>
        <LinkSection alignRight>{before}</LinkSection>
        <LogoHorizontal />
        <LinkSection>{after}</LinkSection>
      </HeaderContain>
    </Row>
  )
}

export const HeaderContain = props => (
  <SectionContent
    padding={[0, '10%']}
    flexFlow="row"
    alignItems="center"
    justifyContent="space-around"
    {...props}
  />
)

export const LinkSection = gloss({
  flex: 4,
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, '2.5%'],
  maxWidth: 380,
  alignItems: 'center',
})
