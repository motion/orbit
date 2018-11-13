import * as React from 'react'
import { view, attach, provide } from '@mcro/black'
import * as UI from '@mcro/ui'
import { SubPaneStore } from './SubPaneStore'
import { SelectionStore } from '../stores/SelectionStore'
import { BORDER_RADIUS } from '../constants'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { StaticContainer } from '../views/StaticContainer'
import { AppType } from '@mcro/models'
import { CSSPropertySetStrict } from '@mcro/css'

export type SubPaneProps = CSSPropertySetStrict & {
  id: string
  type?: AppType
  preventScroll?: boolean
  store?: SubPaneStore
  style?: Object
  after?: React.ReactNode
  before?: React.ReactNode
  fadeBottom?: boolean
  onScrollNearBottom?: Function
  extraCondition?: () => boolean
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  onChangeHeight?: (height: number) => void
  offsetY?: number
}

@attach('paneManagerStore', 'orbitWindowStore', 'selectionStore')
@provide({
  subPaneStore: SubPaneStore,
})
@view
export class SubPane extends React.Component<SubPaneProps & { subPaneStore?: SubPaneStore }> {
  render() {
    const {
      children,
      subPaneStore,
      style,
      after,
      fadeBottom,
      before,
      preventScroll,
      offsetY,
      ...props
    } = this.props
    const { isActive, isLeft } = subPaneStore.positionState
    return (
      <SubPaneFrame isActive={isActive}>
        {typeof before === 'function' ? before(isActive) : before}
        {!!offsetY && <div style={{ height: offsetY, pointerEvents: 'none' }} />}
        <SubPaneInner forwardRef={subPaneStore.subPaneInner}>
          <Pane
            isActive={isActive}
            isLeft={isLeft}
            style={style}
            height={subPaneStore.contentHeight}
            forwardRef={subPaneStore.paneRef}
            preventScroll={preventScroll}
            {...props}
          >
            <PaneContentInner style={{ maxHeight: subPaneStore.maxHeight }}>
              <StaticContainer key={0}>{children}</StaticContainer>
            </PaneContentInner>
          </Pane>
        </SubPaneInner>
        {after}
      </SubPaneFrame>
    )
  }
}

// we cant animate out as of yet because we are changing the height
// so it would show overflowing content as the main pane got smaller
// changing opacity here will be instant so avoid that bug
const SubPaneFrame = view(UI.FullScreen, {
  pointerEvents: 'none',
  opacity: 0,
  isActive: {
    opacity: 1,
  },
})

const Pane = view(UI.View, {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  transition: 'all ease 70ms',
  overflowX: 'hidden',
  overflowY: 'auto',
  borderBottomRadius: BORDER_RADIUS,
  padding: [0, 12],
  margin: [0, 0, 0],
  preventScroll: {
    overflowY: 'hidden',
  },
  isActive: {
    pointerEvents: 'auto',
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
  pointerEvents: 'none',
})

const PaneContentInner = view({
  position: 'relative',
})
