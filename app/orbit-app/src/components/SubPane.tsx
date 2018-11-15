import * as React from 'react'
import { view, StoreContext } from '@mcro/black'
import * as UI from '@mcro/ui'
import { SubPaneStore } from './SubPaneStore'
import { BORDER_RADIUS } from '../constants'
import { AppType } from '@mcro/models'
import { CSSPropertySetStrict } from '@mcro/css'
import { useStore } from '@mcro/use-store'

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
  onChangeHeight?: (height: number) => void
  offsetY?: number
}

type Props = SubPaneProps & { subPaneStore?: SubPaneStore; children: any }

export const SubPane = React.memo((props: Props) => {
  const { paneManagerStore, selectionStore } = React.useContext(StoreContext)
  const subPaneStore = useStore(SubPaneStore, { paneManagerStore, selectionStore, ...props })
  const { isActive, isLeft } = subPaneStore.positionState
  return (
    <SubPaneFrame isActive={isActive}>
      {typeof props.before === 'function' ? props.before(isActive) : props.before}
      {!!props.offsetY && <div style={{ height: props.offsetY, pointerEvents: 'none' }} />}
      <SubPaneInner forwardRef={subPaneStore.innerPaneRef}>
        <Pane
          isActive={isActive}
          isLeft={isLeft}
          style={props.style}
          height={subPaneStore.contentHeight}
          forwardRef={subPaneStore.paneRef}
          preventScroll={props.preventScroll}
          transition={props.transition}
          {...props}
        >
          <PaneContentInner style={{ maxHeight: subPaneStore.maxHeight }}>
            {props.children}
          </PaneContentInner>
        </Pane>
      </SubPaneInner>
      {props.after}
    </SubPaneFrame>
  )
})

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
