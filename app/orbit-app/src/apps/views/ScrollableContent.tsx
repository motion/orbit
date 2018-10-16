import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { AppStore } from '../../pages/AppPage/AppStore'

const PeekContentChrome = view(UI.Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
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

@view.attach('appStore')
export class ScrollableContent extends React.Component<{ appStore?: AppStore }> {
  render() {
    const { children, appStore } = this.props
    return (
      <PeekContentChrome>
        <ContentInner forwardRef={appStore.contentFrame}>{children}</ContentInner>
      </PeekContentChrome>
    )
  }
}
