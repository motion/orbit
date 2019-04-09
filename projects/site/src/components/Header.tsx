import { gloss } from '@o/gloss'
import { Button, Popover, Row, View } from '@o/ui'
import * as ReactNavigation from '@react-navigation/web'
import React from 'react'
import { useScreenSize } from '../hooks/useScreenSize'
import { LogoHorizontal } from '../views/LogoHorizontal'
import { LogoVertical } from '../views/LogoVertical'
import { Text } from '../views/Text'

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
  navigation?: any
  routeKey?: string
  routeName?: string
  params?: Object
  children?: any
  fontSize?: any
}

export function Link({ children, fontSize, ...props }: LinkProps) {
  return (
    <LinkText fontSize={fontSize} onClick={e => e.preventDefault()}>
      <ReactNavigation.Link {...props}>{children}</ReactNavigation.Link>
    </LinkText>
  )
}

export const LinksLeft = props => (
  <>
    <Link {...props} routeName="Home">
      Examples
    </Link>
    <Link {...props} routeName="Docs">
      Docs
    </Link>
    <Link {...props} routeName="Home">
      Security
    </Link>
  </>
)

export const LinksRight = props => (
  <>
    <Link {...props} routeName="Home">
      Pricing
    </Link>
    <Link {...props} routeName="Home">
      Team
    </Link>
    <Link {...props} routeName="Home">
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
