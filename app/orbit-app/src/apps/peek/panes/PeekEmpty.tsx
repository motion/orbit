import * as React from 'react'
import * as UI from '@mcro/ui'
import { PeekPaneProps } from '../PeekPaneProps'

const EMPTY_ITEM = {
  title: 'nothing found',
  icon: null,
  subtitle: null,
}

export const PeekEmpty = ({ item = EMPTY_ITEM }: PeekPaneProps) =>
  !item ? null : (
    <div style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      {item.icon ? (
        <img src={`/icons/${item.icon}`} style={{ width: 64, height: 64 }} />
      ) : null}
      <UI.Text size={2} fontWeight={600}>
        {item.title}
      </UI.Text>
      {item.subtitle ? <UI.Text size={1}>{item.subtitle}</UI.Text> : null}
      {item.content ? (
        <UI.Text style={{ marginTop: 20 }} size={1}>
          {item.context.map(({ active, text }) => (
            <UI.Text $sentence opacity={active ? 1 : 0.2}>
              {text}
            </UI.Text>
          ))}
        </UI.Text>
      ) : null}
      {item.body}
    </div>
  )
