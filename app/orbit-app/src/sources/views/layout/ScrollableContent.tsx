import * as React from 'react'
import { view, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import { AppPageStore } from '../../../pages/AppPage/AppPageStore'

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

@attach('viewStore')
export class ScrollableContent extends React.Component<{
  scrollTo?: string
  viewStore?: AppPageStore
}> {
  componentDidMount() {
    this.updateScroll()
  }
  componentDidUpdate(prevProps) {
    if (this.props.scrollTo !== prevProps.scrollTo) {
      this.updateScroll()
    }
  }

  updateScroll() {
    const { viewStore, scrollTo } = this.props
    if (scrollTo) {
      const node = viewStore.contentFrame.current
      const div = node.querySelector(scrollTo) as HTMLDivElement
      node.scrollTop = div.offsetTop
    }
  }

  render() {
    const { children, viewStore } = this.props
    return (
      <PeekContentChrome>
        <ContentInner forwardRef={viewStore.contentFrame}>{children}</ContentInner>
      </PeekContentChrome>
    )
  }
}
