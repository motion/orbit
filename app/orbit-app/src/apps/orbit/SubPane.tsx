import * as React from 'react'
import { view } from '@mcro/black'
import * as _ from 'lodash'
import * as UI from '@mcro/ui'
import { CSSPropertySet } from '@mcro/gloss'
import { SubPaneStore } from './SubPaneStore'
import { AppStore } from '../../stores/AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { SearchStore } from '../../stores/SearchStore'
import { SelectionStore } from '../../stores/SelectionStore'

export type SubPaneProps = CSSPropertySet & {
  store?: SubPaneStore
  style?: Object
  after?: React.ReactNode
  before?: React.ReactNode
  fadeBottom?: boolean
  name?: string
  onScrollNearBottom?: Function
  extraCondition?: () => boolean
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
}

const Pane = view(UI.View, {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  transition: 'all ease 120ms',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: [0, 14],
  margin: [0, 0, 0],
  // pointerEvents: 'none',
  // opacity: 0,
  isActive: {
    opacity: 1,
    '& > *': {
      pointerEvents: 'auto',
    },
  },
})
Pane.theme = ({ isLeft, isActive }) => ({
  transform: {
    x: isActive ? 0 : isLeft ? -200 : 200,
  },
})

const OverflowFade = view({
  pointerEvents: 'none',
  position: 'fixed',
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

const SubPaneFrame = view(UI.FullScreen, {
  opacity: 0,
  pointerEvents: 'none',
  isActive: {
    opacity: 1,
    pointerEvents: 'all',
  },
})

const SubPaneInner = view(UI.View, {
  position: 'relative',
  flex: 1,
})

const PaneContentInner = view({
  position: 'relative',
})

@view.attach('paneManagerStore', 'appStore', 'searchStore', 'selectionStore')
@view.provide({
  subPaneStore: SubPaneStore,
})
@view
export class SubPane extends React.Component<SubPaneProps> {
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
    console.log('subPaneStore.isLeft', name, subPaneStore.isLeft)
    return (
      <SubPaneFrame
        isActive={subPaneStore.isActive}
        isLeft={subPaneStore.isLeft}
      >
        {before}
        <SubPaneInner
          forwardRef={subPaneStore.subPaneInner}
          {...containerStyle}
        >
          <Pane
            isActive={subPaneStore.isActive}
            style={style}
            height={subPaneStore.contentHeightLimited}
            forwardRef={subPaneStore.paneRef}
            {...props}
          >
            <PaneContentInner>{children}</PaneContentInner>
            {/* {fadeBottom && (
              <OverflowFade
                isInvisible={!subPaneStore.isActive || subPaneStore.isAtBottom}
              />
            )} */}
          </Pane>
        </SubPaneInner>
        {after}
      </SubPaneFrame>
    )
  }
}
