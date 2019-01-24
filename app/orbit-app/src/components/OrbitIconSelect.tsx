import { gloss, Theme } from '@mcro/gloss'
import { Row } from '@mcro/ui'
import React, { useState } from 'react'
import { Icon } from '../views/Icon'

export default function OrbitIconSelect() {
  const [selected, setSelected] = useState(0)

  return (
    <Row>
      {['orbitSearch', 'orbitTopics', 'orbitPeople', 'orbitMemory', 'orbitLists'].map(
        (icon, index) => (
          <Theme key={icon} name={index === selected ? 'selected' : null}>
            <IconSelect onClick={() => setSelected(index)}>
              <Icon name={icon} />
            </IconSelect>
          </Theme>
        ),
      )}
    </Row>
  )
}

const IconSelect = gloss({
  padding: 10,
  borderRadius: 8,
  margin: [0, 10, 0, 0],
}).theme((_, theme) => ({
  background: theme.background,
  boxShadow: [
    ['inset', 0, 0, 0, 0.5, theme.borderColor.alpha(0.5)],
    [0, 0, 0, 3, theme.borderColor.alpha(0.25)],
  ],
  '&:hover': {
    background: theme.backgroundHover,
  },
}))
