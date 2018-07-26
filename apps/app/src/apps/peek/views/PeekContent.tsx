import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'

const PeekContentChrome = view(UI.Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
  // without this, things strangely overflow
  overflow: 'hidden',
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

export class PeekContent extends React.Component<{ peekStore: PeekStore }> {
  render() {
    const { children, peekStore } = this.props
    return (
      <PeekContentChrome>
        <ContentInner forwardRef={peekStore.contentFrame}>
          {children}
        </ContentInner>
      </PeekContentChrome>
    )
  }
}
