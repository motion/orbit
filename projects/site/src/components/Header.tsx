import { gloss } from '@o/gloss'
import { Row } from '@o/ui'
import React from 'react'
import { LogoVertical } from '../views/LogoVertical'
import { Text } from '../views/Text'

export function Header() {
  return (
    <Row alignItems="center" justifyContent="space-between" padding={[40, 0]}>
      <LinkSection alignRight>
        <Link>Examples</Link>
        <Link>Docs</Link>
        <Link>Security</Link>
      </LinkSection>

      <LogoVertical />

      <LinkSection>
        <Link>Pricing</Link>
        <Link>Team</Link>
        <Link>Blog</Link>
      </LinkSection>
    </Row>
  )
}

const LinkSection = gloss({
  width: '30%',
  flexFlow: 'row',
  justifyContent: 'space-around',
  alignRight: {
    justifyContent: 'flex-end',
  },
})

const Link = gloss(Text, {
  fontSize: 16,
  textDecoration: 'none',
  padding: [0, '8%'],
})

Link.defaultProps = {
  tagName: 'a',
  alpha: 0.65,
}
