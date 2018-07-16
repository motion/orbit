import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const PeekContentChrome = view(UI.Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
})

PeekContentChrome.theme = ({ theme }) => ({
  background: theme.base.background || '#fefefe',
})

const ContentInner = view(UI.Col, {
  overflowY: 'scroll',
  flex: 1,
  fontSize: 16,
  lineHeight: '1.6rem',
  wordBreak: 'break-word',
})

export const PeekContent = ({ children }) => {
  return (
    <PeekContentChrome>
      <ContentInner>{children}</ContentInner>
    </PeekContentChrome>
  )
}
