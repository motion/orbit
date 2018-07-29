import * as React from 'react'
import { view, on, react } from '@mcro/black'
import * as _ from 'lodash'
import * as UI from '@mcro/ui'
import { CSSPropertySet } from '@mcro/gloss'
import { AppStore } from '../../stores/AppStore'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'

const EXTRA_PAD = 5

const Pane = view(UI.View, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  transition: 'all ease 100ms',
  overflowX: 'hidden',
  overflowY: 'scroll',
  padding: [EXTRA_PAD, 14, 0],
  margin: [-EXTRA_PAD, 0, 0],
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
  transition: 'all ease-in 250ms',
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

DockedPaneInner.theme = ({ theme }) => ({
  background: theme.base.background,
})

const PaneContentInner = view({
  position: 'relative',
})

type Props = CSSPropertySet & {
  store?: DockedPaneStore
  style?: Object
  after?: React.ReactNode
  before?: React.ReactNode
  fadeBottom?: boolean
  name?: string
}

class DockedPaneStore {
  props: {
    appStore: AppStore
    paneStore: OrbitDockedPaneStore
    name: string
    extraCondition: () => boolean
  }

  paneRef = React.createRef<HTMLDivElement>()
  isAtBottom = false
  childMutationObserver = null

  get paneNode() {
    return this.paneRef.current || null
  }

  get paneInnerNode() {
    return this.paneNode.firstChild as HTMLDivElement
  }

  addObserver = (node, cb) => {
    const observer = new MutationObserver(cb)
    observer.observe(node, { childList: true, subtree: true })
    on(this, observer)
    return () => observer.disconnect()
  }

  didMount() {
    on(
      this,
      this.paneRef.current,
      'scroll',
      _.throttle(this.handlePaneChange, 16 * 3),
    )
    this.addObserver(this.paneRef.current, this.handlePaneChange)
    this.handlePaneChange()
    this.updateOnHeight()
  }

  handlePaneChange = () => {
    this.updateOnHeight()
    this.updateScrolledTo()
  }

  updatePaneHeightOnActive = react(
    () => this.isActive,
    () => {
      const res = this.updateOnHeight()
      if (!res) {
        throw react.cancel
      }
    },
  )

  updateOnHeight = () => {
    if (!this.isActive || !this.props.appStore || !this.paneNode) {
      return false
    }
    const { top, height } = this.paneInnerNode.getBoundingClientRect()
    this.props.appStore.setContentHeight(top + height)
  }

  updateScrolledTo = () => {
    const pane = this.paneNode
    const innerHeight = this.paneInnerNode.clientHeight
    const scrolledTo = pane.scrollTop + pane.clientHeight
    if (innerHeight <= scrolledTo) {
      this.isAtBottom = true
    } else {
      this.isAtBottom = false
    }
  }

  // prevents uncessary and expensive OrbitCard re-renders
  get isActive() {
    const { extraCondition, name, paneStore } = this.props
    const isActive =
      name === paneStore.activePane &&
      (extraCondition ? extraCondition() : true)
    return isActive
  }
}

@view.attach('paneStore', 'appStore')
@view.attach({
  store: DockedPaneStore,
})
@view
export class OrbitDockedPane extends React.Component<Props> {
  render() {
    const {
      children,
      store,
      style,
      after,
      fadeBottom,
      name,
      before,
      containerStyle,
      ...props
    } = this.props
    return (
      <DockedPaneFrame isActive={store.isActive}>
        {before}
        <DockedPaneInner {...containerStyle}>
          <OverflowFade if={fadeBottom} isInvisible={store.isAtBottom} />
          <Pane
            isActive={store.isActive}
            style={style}
            forwardRef={store.paneRef}
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
