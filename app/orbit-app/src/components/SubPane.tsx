import * as React from 'react'
import { view, attach, provide } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CSSPropertySet } from '@mcro/gloss'
import { SubPaneStore } from './SubPaneStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'
import { SearchStore } from '../stores/SearchStore'
import { SelectionStore } from '../stores/SelectionStore'
import { BORDER_RADIUS } from '../constants'
import { PaneManagerStore } from '../stores/PaneManagerStore'

export type SubPaneProps = CSSPropertySet & {
  preventScroll?: boolean
  store?: SubPaneStore
  style?: Object
  after?: React.ReactNode
  before?: React.ReactNode
  fadeBottom?: boolean
  name?: string
  onScrollNearBottom?: Function
  extraCondition?: () => boolean
  orbitWindowStore?: OrbitWindowStore
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
}

// we cant animate out as of yet because we are changing the height
// so it would show overflowing content as the main pane got smaller
// changing opacity here will be instant so avoid that bug
const SubPaneFrame = view(UI.FullScreen, {
  pointerEvents: 'none',
  opacity: 0,
  isActive: {
    opacity: 1,
    pointerEvents: 'inherit',
  },
})

const Pane = view(UI.View, {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  transition: 'all ease 100ms',
  overflowX: 'hidden',
  overflowY: 'auto',
  borderBottomRadius: BORDER_RADIUS,
  padding: [0, 12],
  margin: [0, 0, 0],
  preventScroll: {
    overflowY: 'hidden',
  },
}).theme(({ isLeft, isActive }) => ({
  opacity: isActive ? 1 : 0,
  transform: {
    x: isActive ? 0 : isLeft ? -10 : 10,
  },
}))

const SubPaneInner = view(UI.View, {
  position: 'relative',
  flex: 1,
})

const PaneContentInner = view({
  position: 'relative',
})

@attach('paneManagerStore', 'orbitWindowStore', 'searchStore', 'selectionStore')
@provide({
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
      preventScroll,
      ...props
    } = this.props
    const { isActive, isLeft } = subPaneStore.positionState
    return (
      <SubPaneFrame isActive={isActive} name={name}>
        {before}
        <SubPaneInner forwardRef={subPaneStore.subPaneInner} {...containerStyle}>
          <Pane
            isActive={isActive}
            isLeft={isLeft}
            style={style}
            height={subPaneStore.contentHeightLimited}
            forwardRef={subPaneStore.paneRef}
            preventScroll={preventScroll}
            {...props}
          >
            <PaneContentInner>{children}</PaneContentInner>
          </Pane>
        </SubPaneInner>
        {after}
      </SubPaneFrame>
    )
  }
}
