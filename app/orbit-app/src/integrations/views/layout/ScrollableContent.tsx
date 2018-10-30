import * as React from 'react'
import { view, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import { AppStore } from '../../../pages/AppPage/AppStore'

const PeekContentChrome = view(UI.Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
  // without this, things strangely overflow
  overflow: 'hidden',
})

const ContentInner = view(UI.Col, {
  overflowX: 'auto',
  overflowY: 'auto',
  flex: 1,
  fontSize: 16,
  lineHeight: '1.6rem',
  wordBreak: 'break-word',
})

@attach('appStore')
export class ScrollableContent extends React.Component<{ scrollTo?: string; appStore?: AppStore }> {
  componentDidMount() {
    this.updateScroll()
  }
  componentDidUpdate(prevProps) {
    if (this.props.scrollTo !== prevProps.scrollTo) {
      this.updateScroll()
    }
  }

  updateScroll() {
    const { appStore, scrollTo } = this.props
    if (scrollTo) {
      const node = appStore.contentFrame.current
      const div = node.querySelector(scrollTo) as HTMLDivElement
      node.scrollTop = div.offsetTop
    }
  }

  render() {
    const { children, appStore } = this.props
    return (
      <PeekContentChrome>
        <ContentInner forwardRef={appStore.contentFrame}>{children}</ContentInner>
      </PeekContentChrome>
    )
  }
}
