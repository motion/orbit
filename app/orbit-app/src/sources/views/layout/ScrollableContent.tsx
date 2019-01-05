import * as React from 'react'
import { attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import { AppPageStore } from '../../../pages/AppPage/AppPageStore'
import { gloss } from '@mcro/gloss'

const PeekContentChrome = gloss(UI.Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
  // without this, things strangely overflow
  overflow: 'hidden',
})

const ContentInner = gloss(UI.Col, {
  overflowX: 'auto',
  overflowY: 'auto',
  flex: 1,
  fontSize: 16,
  lineHeight: '1.6rem',
  wordBreak: 'break-word',
})

@attach('appPageStore')
export class ScrollableContent extends React.Component<{
  scrollTo?: string
  appPageStore?: AppPageStore
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
    const { appPageStore, scrollTo } = this.props
    if (scrollTo && appPageStore) {
      const node = appPageStore.contentFrame.current
      const div = node.querySelector(scrollTo) as HTMLDivElement
      node.scrollTop = div.offsetTop
    }
  }

  render() {
    const { children, appPageStore } = this.props
    return (
      <PeekContentChrome>
        <ContentInner forwardRef={appPageStore && appPageStore.contentFrame}>
          {children}
        </ContentInner>
      </PeekContentChrome>
    )
  }
}
