import { CSSPropertySetStrict } from '@mcro/css'
import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import * as UI from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { SubPaneStore } from './SubPaneStore'

export type SubPaneProps = CSSPropertySetStrict & {
  id: number
  type?: AppType
  fullHeight?: boolean
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

export const SubPane = observer(function SubPane(props: Props) {
  const transition = props.transition || 'opacity ease 90ms, transform ease 120ms'
  const subPaneStore = useStore(SubPaneStore, props)
  const { isActive, isLeft } = subPaneStore.positionState
  const height = props.fullHeight ? 'auto' : subPaneStore.contentHeight
  return (
    <SubPaneFrame isActive={isActive}>
      {typeof props.before === 'function' ? props.before(isActive) : props.before}
      {!!props.offsetY && <div style={{ height: props.offsetY, pointerEvents: 'none' }} />}
      <SubPaneInner forwardRef={subPaneStore.innerPaneRef}>
        <Pane
          key={Math.random()}
          isActive={isActive}
          isLeft={isLeft}
          style={props.style}
          height={height}
          forwardRef={subPaneStore.paneRef}
          preventScroll={props.preventScroll}
          transition={transition}
          {...props.fullHeight && { bottom: 0 }}
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
const SubPaneFrame = gloss(UI.FullScreen, {
  pointerEvents: 'none',
  opacity: 0,
  isActive: {
    opacity: 1,
  },
})

const Pane = gloss(UI.View, {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  overflow: 'hidden',
}).theme(({ isLeft, isActive }) => ({
  opacity: isActive ? 1 : 0,
  pointerEvents: isActive ? 'auto' : 'inherit',
  transform: {
    x: isActive ? 0 : isLeft ? -10 : 10,
  },
}))

const SubPaneInner = gloss(UI.View, {
  position: 'relative',
  flex: 1,
  pointerEvents: 'none',
})

const PaneContentInner = gloss({
  position: 'relative',
  flex: 1,
})
