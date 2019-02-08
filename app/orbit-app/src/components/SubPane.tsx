import { CSSPropertySetStrict } from '@mcro/css'
import { gloss } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppType } from '../apps/AppTypes'
import { SubPaneStore } from './SubPaneStore'

export type SubPaneProps = CSSPropertySetStrict & {
  id: any
  type?: AppType
  fullHeight?: boolean
  style?: Object
  after?: React.ReactNode
  before?: React.ReactNode
  onScrollNearBottom?: Function
  onChangeHeight?: (height: number) => void
  offsetY?: number
  children?: any
  transition?: string
}

type Props = SubPaneProps & { subPaneStore?: SubPaneStore; children: any }

export const SubPane = observer(function SubPane(props: Props) {
  const {
    fullHeight,
    style,
    after,
    before,
    offsetY,
    transition = 'opacity ease 90ms, transform ease 120ms',
    children,
    ...rest
  } = props
  const subPaneStore = useStore(SubPaneStore, props)
  const { isActive, isLeft } = subPaneStore.positionState
  const height = fullHeight ? 'auto' : subPaneStore.fullHeight
  return (
    <SubPaneFrame isActive={isActive}>
      {typeof before === 'function' ? before(isActive) : before}
      {!!offsetY && <div style={{ height: offsetY, pointerEvents: 'none' }} />}
      <SubPaneInner ref={subPaneStore.innerPaneRef}>
        <Pane
          isActive={isActive}
          isLeft={isLeft}
          style={style}
          height={height}
          ref={subPaneStore.paneRef}
          transition={transition}
          {...fullHeight && { bottom: 0 }}
          {...rest}
        >
          {/* used by SubPaneStore to find real content height */}
          <PaneContentInner
            style={{ maxHeight: subPaneStore.maxHeight, flex: fullHeight ? 1 : 'none' }}
          >
            {children}
          </PaneContentInner>
        </Pane>
      </SubPaneInner>
      {after}
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
    pointerEvents: 'inherit',
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
  pointerEvents: isActive ? 'inherit' : 'none',
  transform: {
    x: isActive ? 0 : isLeft ? -10 : 10,
  },
}))

const SubPaneInner = gloss(UI.View, {
  position: 'relative',
  flex: 1,
})

const PaneContentInner = gloss({
  position: 'relative',
})
