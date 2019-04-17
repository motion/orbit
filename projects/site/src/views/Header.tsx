import { gloss, useTheme } from '@o/gloss'
import {
  BorderBottom,
  Button,
  Popover,
  Row,
  RowProps,
  SimpleText,
  SimpleTextProps,
  View,
} from '@o/ui'
import React from 'react'
import { Link as RouterLink } from 'react-navi'
import { LinkProps as NaviLinkProps } from 'react-navi/dist/types/Link'
import { useScreenSize } from '../hooks/useScreenSize'
import { Navigation } from '../SiteRoot'
import { LogoHorizontal } from './LogoHorizontal'
import { Overdrive } from './Overdrive'
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

export type LinkProps = Pick<NaviLinkProps, 'href'> & SimpleTextProps
export function Link({ children, fontSize = 16, href, width, margin, ...props }: LinkProps) {
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

const HeaderLink = props => <Link width="33%" {...props} />

export const LinksLeft = props => {
  return (
    <Overdrive id="links-left">
      <LinkRow>
        <HeaderLink {...props} href="/">
          Start
        </HeaderLink>
        <HeaderLink {...props} href="/docs">
          Docs
        </HeaderLink>
        <HeaderLink {...props} href="/">
          Apps
        </HeaderLink>
      </LinkRow>
    </Overdrive>
  )
}

export const LinksRight = props => (
  <Overdrive id="links-right">
    <LinkRow>
      <HeaderLink {...props} href="/">
        Beta
      </HeaderLink>
      <HeaderLink {...props} href="/">
        Blog
      </HeaderLink>
      <HeaderLink {...props} href="/">
        About
      </HeaderLink>
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

export function Header({ slim, ...rest }: { slim?: boolean } & RowProps) {
  const size = useScreenSize()
  const theme = useTheme()

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
      <Row background={theme.background.lighten(0.3)} position="relative" {...rest}>
        <HeaderContain height={32}>
          <LinkSection alignRight>{before}</LinkSection>
          <LogoHorizontal />
          <LinkSection>{after}</LinkSection>
        </HeaderContain>
        {theme.background.isLight() ? <BorderBottom /> : null}
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
      {...rest}
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
