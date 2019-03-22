import { gloss, SimpleText } from '@o/gloss'
import { Row } from '@o/ui'
import React from 'react'

export function Header() {
  return (
    <Row alignItems="center" justifyContent="center" flex={1} padding={[20, 0]}>
      <LinkSection>
        <Link>Examples</Link>
        <Link>Docs</Link>
        <Link>Security</Link>
      </LinkSection>
    </Row>
  )
}

const LinkSection = gloss({
  width: '25%',
  flexFlow: 'row',
})

const Link = gloss(SimpleText, {
  fontSize: 22,
})

Link.defaultProps = {
  tagName: 'a',
}
