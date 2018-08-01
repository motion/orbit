import * as React from 'react'
import { view } from '@mcro/black'
import * as _ from 'lodash'
import * as UI from '@mcro/ui'
import { CSSPropertySet } from '@mcro/gloss'
import { SubPaneStore } from './SubPaneStore'

type Props = CSSPropertySet & {
  store?: SubPaneStore
  style?: Object
  after?: React.ReactNode
  before?: React.ReactNode
  fadeBottom?: boolean
  name?: string
}

const EXTRA_PAD = 6

const Pane = view(UI.View, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  transition: 'all ease 100ms',
  overflowX: 'hidden',
  overflowY: 'scroll',
  padding: [0, 14, 0],
  margin: [0, 0, 0],
  // pointerEvents: 'none',
  opacity: 0,
  transform: {
    x: 10,
  },
  isActive: {
    opacity: 1,
    transform: {
      x: 0,
    },
    '& > *': {
      pointerEvents: 'auto',
    },
  },
})

const OverflowFade = view({
  pointerEvents: 'none',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 100,
  zIndex: 10000000,
  borderRadius: 20,
  overflow: 'hidden',
  opacity: 1,
  transition: 'all ease-in 100ms',
  isInvisible: {
    opacity: 0,
  },
})

OverflowFade.theme = ({ theme }) => ({
  background: `linear-gradient(transparent, ${theme.base.background})`,
})

const DockedPaneFrame = view(UI.FullScreen, {
  opacity: 0,
  pointerEvents: 'none',
  isActive: {
    opacity: 1,
    pointerEvents: 'all',
  },
})

const DockedPaneInner = view(UI.View, {
  position: 'relative',
  flex: 1,
})

const PaneContentInner = view({
  position: 'relative',
})

@view.attach('paneStore', 'appStore', 'searchStore')
@view.provide({
  subPaneStore: SubPaneStore,
})
@view
export class SubPane extends React.Component<Props> {
  render() {
    const {
      children,
      subPaneStore,
      style,
      after,
      fadeBottom,
      name,
      before,
      containerStyle,
      ...props
    } = this.props
    return (
      <DockedPaneFrame isActive={subPaneStore.isActive}>
        {before}
        <DockedPaneInner {...containerStyle}>
          {fadeBottom && <OverflowFade isInvisible={subPaneStore.isAtBottom} />}
          <Pane
            isActive={subPaneStore.isActive}
            style={style}
            forwardRef={subPaneStore.paneRef}
            {...props}
          >
            <PaneContentInner>{children}</PaneContentInner>
          </Pane>
        </DockedPaneInner>
        {after}
      </DockedPaneFrame>
    )
  }
}
