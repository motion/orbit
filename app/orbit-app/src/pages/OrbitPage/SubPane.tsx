import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CSSPropertySet } from '@mcro/gloss'
import { SubPaneStore } from './SubPaneStore'
import { OrbitStore } from './OrbitStore'
import { PaneManagerStore } from './PaneManagerStore'
import { SearchStore } from './orbitDocked/SearchStore'
import { SelectionStore } from './orbitDocked/SelectionStore'
import { BORDER_RADIUS } from '../../constants'
import { StaticContainer } from '../../views/StaticContainer'

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
  orbitStore?: OrbitStore
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
}

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
  transition: 'all ease 120ms',
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

@view.attach('paneManagerStore', 'orbitStore', 'searchStore', 'selectionStore')
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
            <PaneContentInner>
              <StaticContainer>{children}</StaticContainer>
            </PaneContentInner>
          </Pane>
        </SubPaneInner>
        {after}
      </SubPaneFrame>
    )
  }
}
