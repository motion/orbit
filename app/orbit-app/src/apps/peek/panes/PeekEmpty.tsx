import * as React from 'react'
import * as UI from '@mcro/ui'
import { PeekPaneProps } from '../PeekPaneProps'

const EMPTY_BIT = {
  title: 'nothing found',
  icon: null,
  subtitle: null,
}

export const PeekEmpty = ({ bit = EMPTY_BIT }: PeekPaneProps) =>
  !bit ? null : (
    <div style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      {bit.icon ? (
        <img src={`/icons/${bit.icon}`} style={{ width: 64, height: 64 }} />
      ) : null}
      <UI.Text size={2} fontWeight={600}>
        {bit.title}
      </UI.Text>
      {bit.subtitle ? <UI.Text size={1}>{bit.subtitle}</UI.Text> : null}
      {bit.content ? (
        <UI.Text style={{ marginTop: 20 }} size={1}>
          {bit.context.map(({ active, text }) => (
            <UI.Text $sentence opacity={active ? 1 : 0.2}>
              {text}
            </UI.Text>
          ))}
        </UI.Text>
      ) : null}
      {bit.body}
    </div>
  )
