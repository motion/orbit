import { gloss } from '@o/gloss'
import { Button, Popover, Row, View } from '@o/ui'
import React from 'react'
import { useScreenSize } from '../hooks/useScreenSize'
import { LogoVertical } from '../views/LogoVertical'
import { Text } from '../views/Text'

const Link = gloss(Text, {
  fontSize: 16,
  width: 100,
  textDecoration: 'none',
  textAlign: 'center',
})

Link.defaultProps = {
  tagName: 'a',
  alpha: 0.65,
}

const menusLeft = (
  <>
    <Link>Examples</Link>
    <Link>Docs</Link>
    <Link>Security</Link>
  </>
)

const menusRight = (
  <>
    <Link>Pricing</Link>
    <Link>Team</Link>
    <Link>Blog</Link>
  </>
)

export function Header() {
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
          {menusLeft}
          {menusRight}
        </Popover>
      </>
    )
  } else {
    before = menusLeft
    after = menusRight
  }

  return (
    <Row alignItems="center" justifyContent="space-around" padding={['3.5vh', 0]}>
      <LinkSection alignRight>{before}</LinkSection>
      <LogoVertical />
      <LinkSection>{after}</LinkSection>
    </Row>
  )
}

const LinkSection = gloss({
  flex: 1,
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, '5%'],
})
