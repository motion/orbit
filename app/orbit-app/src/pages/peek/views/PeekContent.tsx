import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'

const PeekContentChrome = view(UI.Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
  background: '#fbfbfb',
  // without this, things strangely overflow
  overflow: 'hidden',
})

const ContentInner = view(UI.Col, {
  overflowY: 'auto',
  flex: 1,
  fontSize: 16,
  lineHeight: '1.6rem',
  wordBreak: 'break-word',
})

@view.attach('peekStore')
export class PeekContent extends React.Component<{ peekStore?: PeekStore }> {
  render() {
    const { children, peekStore } = this.props
    return (
      <PeekContentChrome>
        <ContentInner forwardRef={peekStore.contentFrame}>{children}</ContentInner>
      </PeekContentChrome>
    )
  }
}
