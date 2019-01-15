import * as React from 'react'
import * as UI from '@mcro/ui'
import { gloss } from '@mcro/gloss'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { observer } from 'mobx-react-lite'

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

export default observer(function ScrollableContent(props: { scrollTo?: string; children: any }) {
  const { appPageStore } = useStoresSafe({ optional: ['appPageStore'] })

  React.useEffect(() => {
    if (props.scrollTo && appPageStore) {
      const node = appPageStore.contentFrame.current
      if (!node) {
        return
      }
      const div = node.querySelector(props.scrollTo) as HTMLDivElement
      node.scrollTop = div.offsetTop
    }
  }, [])

  return (
    <PeekContentChrome>
      <ContentInner forwardRef={appPageStore && appPageStore.contentFrame}>
        {props.children}
      </ContentInner>
    </PeekContentChrome>
  )
})
