import { gloss } from '@o/gloss'
import { Button, Popover, Row, View } from '@o/ui'
import React from 'react'
import { Link as RouterLink } from 'react-navi'
import { useScreenSize } from '../hooks/useScreenSize'
import { LogoHorizontal } from './LogoHorizontal'
import { LogoVertical } from './LogoVertical'
import { Text } from './Text'

const LinkText = gloss(Text, {
  width: 100,
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
  <>
    <Link {...props} href="/">
      Examples
    </Link>
    <Link {...props} href="/docs">
      Docs
    </Link>
    <Link {...props} href="/">
      Security
    </Link>
  </>
)

export const LinksRight = props => (
  <>
    <Link {...props} href="/">
      Pricing
    </Link>
    <Link {...props} href="/">
      Team
    </Link>
    <Link {...props} href="/">
      Blog
    </Link>
  </>
)

export function Header(props: { slim?: boolean }) {
  const size = useScreenSize()

  let before = null
  let after = null

  if (size !== 'large') {
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
  } else {
    before = <LinksLeft />
    after = <LinksRight />
  }

  const padding = props.slim ? ['2vh', 0] : ['3.5vh', 0]

  return (
    <Row alignItems="center" justifyContent="space-around" padding={padding}>
      <LinkSection alignRight>{before}</LinkSection>
      {props.slim ? <LogoHorizontal /> : <LogoVertical />}
      <LinkSection>{after}</LinkSection>
    </Row>
  )
}

export const LinkSection = gloss({
  flex: 1,
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, '5%'],
})
