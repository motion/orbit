import { gloss } from '@mcro/gloss';
import * as UI from '@mcro/ui';
import * as React from 'react';

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

export default function ScrollableContent({
  scrollTo,
  ...props
}: UI.ViewProps & { scrollTo?: string }) {

  // React.useEffect(() => {
  //   if (props.scrollTo && appPageStore) {
  //     const node = appPageStore.contentFrame.current
  //     if (!node) {
  //       return
  //     }
  //     const div = node.querySelector(props.scrollTo) as HTMLDivElement
  //     node.scrollTop = div.offsetTop
  //   }
  // }, [])

  return (
    <PeekContentChrome>
      <ContentInner ref={appPageStore && appPageStore.contentFrame} {...props} />
    </PeekContentChrome>
  )
}
