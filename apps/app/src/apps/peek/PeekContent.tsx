import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const PeekContentChrome = view(UI.Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
})

const ContentInner = view(UI.Col, {
  overflowY: 'scroll',
  flex: 1,
  fontSize: 16,
  lineHeight: '1.6rem',
  wordBreak: 'break-word',
})

@view.ui
export class PeekContent extends React.Component {
  render() {
    const { children } = this.props
    return (
      <PeekContentChrome>
        <ContentInner>{children}</ContentInner>
      </PeekContentChrome>
    )
  }
}
