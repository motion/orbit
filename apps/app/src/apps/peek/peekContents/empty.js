import * as React from 'react'
import * as UI from '@mcro/ui'

export const Empty = ({ item }) =>
  item ? (
    <pane css={{ flex: 1 }}>
      <img
        if={item.icon}
        src={`/icons/${item.icon}`}
        css={{ width: 64, height: 64 }}
      />
      <UI.Title size={2} fontWeight={600}>
        {item.title}
      </UI.Title>
      <UI.Title if={item.subtitle} size={1}>
        {item.subtitle}
      </UI.Title>
      <UI.Text if={item.content} css={{ marginTop: 20 }} size={1}>
        {item.context.map(({ active, text }) => (
          <UI.Text $sentence opacity={active ? 1 : 0.2}>
            {text}
          </UI.Text>
        ))}
      </UI.Text>
      {item.body}
    </pane>
  ) : null
