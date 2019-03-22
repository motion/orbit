import { gloss, SimpleText } from '@o/gloss'
import { Row } from '@o/ui'
import React from 'react'
import { LogoVertical } from './LogoVertical'

export function Header() {
  return (
    <Row alignItems="center" justifyContent="space-between" flex={1} padding={[20, 0]}>
      <LinkSection alignRight>
        <Link>Examples</Link>
        <Link>Docs</Link>
        <Link>Security</Link>
      </LinkSection>

      <LogoVertical />

      <LinkSection>
        <Link>Examples</Link>
        <Link>Docs</Link>
        <Link>Security</Link>
      </LinkSection>
    </Row>
  )
}

const LinkSection = gloss({
  width: '30%',
  flexFlow: 'row',
  alignRight: {
    justifyContent: 'flex-end',
  },
})

const Link = gloss(SimpleText, {
  fontSize: 18,
  textDecoration: 'none',
  padding: [0, '8%'],
})

Link.defaultProps = {
  tagName: 'a',
  alpha: 0.65,
}
