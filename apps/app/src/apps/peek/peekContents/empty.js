import * as React from 'react'
import * as UI from '@mcro/ui'

const EMPTY_BIT = {
  title: 'nothign found',
}

export const Empty = ({ bit = EMPTY_BIT }) => (
  <contents css={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
    <img
      if={bit && bit.icon}
      src={`/icons/${bit.icon}`}
      css={{ width: 64, height: 64 }}
    />
    <UI.Text size={2} fontWeight={600}>
      {bit.title}
    </UI.Text>
    <UI.Text if={bit.subtitle} size={1}>
      {bit.subtitle}
    </UI.Text>
    <UI.Text if={bit.content} css={{ marginTop: 20 }} size={1}>
      {bit.context.map(({ active, text }) => (
        <UI.Text $sentence opacity={active ? 1 : 0.2}>
          {text}
        </UI.Text>
      ))}
    </UI.Text>
    {bit.body}
  </contents>
)
