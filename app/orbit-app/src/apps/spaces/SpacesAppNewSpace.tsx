import { Space } from '@o/models'
import { Section } from '@o/ui'
import React, { useState } from 'react'
import { SpaceEdit } from './SpaceEdit'

export function SpacesAppNewSpace() {
  const [newSpace] = useState<Space>({
    name: 'New Space',
  })

  return (
    <Section>
      <SpaceEdit space={newSpace} />
    </Section>
  )
}
