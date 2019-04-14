import { gloss } from '@o/gloss'
import { Button, Popover, Row, View } from '@o/ui'
import React from 'react'
import { Link as RouterLink } from 'react-navi'
import { useScreenSize } from '../hooks/useScreenSize'
import { LogoHorizontal } from './LogoHorizontal'
import { Overdrive } from './Overdrive'
import { SectionContent } from './SectionContent'
import { Text } from './Text'

const LinkText = gloss(Text, {
  userSelect: 'none',
  width: '33%',
  textAlign: 'center',
  transform: {
    y: 2,
  },
  '& a': {
    textDecoration: 'none',
  },
})

LinkText.defaultProps = {
  alpha: 0.65,
  fontSize: 16,
}

type LinkProps = {
  href: string
  navigation?: any
  routeKey?: string
  routeName?: string
  params?: Object
  children?: any
  fontSize?: any
}

export function Link({ children, fontSize, href, ...props }: LinkProps) {
  return (
    <LinkText fontSize={fontSize} onClick={e => e.preventDefault()}>
      <RouterLink href={href} {...props}>
        {children}
      </RouterLink>
    </LinkText>
  )
}

export const LinksLeft = props => (
  <Overdrive id="links-left">
    <LinkRow>
      <Link {...props} href="/">
        Examples
      </Link>
      <Link {...props} href="/docs">
        Docs
      </Link>
      <Link {...props} href="/">
        Security
      </Link>
    </LinkRow>
  </Overdrive>
)

export const LinksRight = props => (
  <Overdrive id="links-right" duration={100000}>
    <LinkRow>
      <Link {...props} href="/">
        Pricing
      </Link>
      <Link {...props} href="/">
        !!!
      </Link>
      <Link {...props} href="/">
        Blog
      </Link>
    </LinkRow>
  </Overdrive>
)

const LinkRow = gloss({
  flexFlow: 'row',
  flex: 1,
  height: 40,
  alignItems: 'center',
  zIndex: 1000000000,
  position: 'relative',
})

export function Header() {
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
        <Popover
          openOnClick
          closeOnClickAway
          target={
            <Button size={1.2} chromeless>
              =
            </Button>
          }
        >
          <LinksLeft />
          <LinksRight />
        </Popover>
      </>
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
    padding={[0, '5%']}
    flexFlow="row"
    alignItems="center"
    justifyContent="space-around"
    {...props}
  />
)

export const LinkSection = gloss({
  flex: 1,
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, '2.5%'],
  maxWidth: 380,
})
