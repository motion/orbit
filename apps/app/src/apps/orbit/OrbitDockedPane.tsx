import * as React from 'react'
import { view, on, react } from '@mcro/black'
import * as _ from 'lodash'
import { BORDER_RADIUS } from '../../constants'
import * as UI from '@mcro/ui'
import { CSSPropertySet } from '@mcro/gloss'

const EXTRA_PAD = 40

const getInnerHeight = node => {
  const lastNode = _.last(Array.from(node.children))
  if (!lastNode) {
    return null
  }
  return lastNode.offsetTop + lastNode.clientHeight
}

class DockedPaneStore {
  paneRef: { current?: HTMLElement } = React.createRef()
  isAtBottom = false
  childMutationObserver = null

  get node() {
    return this.paneRef.current || null
  }

  addObserver = (node, cb, options = { childList: true }) => {
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
    this.updateScrolledTo(this.node)
  }

  // scrollToSelectedCard = react(
  //   () => this.props.appStore.selectedCardRef,
  //   cardRef => {
  //     if (!this.isActive) {
  //       throw react.cancel
  //     }
  //     // cardRef.scrollIntoViewIfNeeded()
  //     // const frameBottom = this.paneRef.current.clientHeight
  //     // const cardBottom = cardRef.offsetTop + cardRef.clientHeight
  //     // if (cardBottom <= frameBottom) {
  //     //   throw react.cancel
  //     // }
  //     // this.paneRef.current.scrollTop = cardBottom - frameBottom + EXTRA_PAD
  //   },
  //   {
  //     immediate: true,
  //   },
  // )

  updatePaneHeightOnActive = react(() => this.isActive, this.updateOnHeight)

  updateOnHeight() {
    if (!this.isActive || !this.props.appStore || !this.node) {
      return
    }
    const innerHeight = getInnerHeight(this.node)
    const aboveHeight = this.node.getBoundingClientRect().top
    this.props.appStore.setContentHeight(innerHeight + aboveHeight)
  }

  updateScrolledTo = node => {
    const innerHeight = getInnerHeight(node)
    const scrolledTo = node.scrollTop + node.clientHeight
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
      (extraCondition ? extraCondition.hasQuery() : true)
    return isActive
  }
}

const Pane = view(UI.View, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  transition: 'all ease 100ms',
  borderRadius: BORDER_RADIUS,
  overflowX: 'hidden',
  overflowY: 'scroll',
  padding: [EXTRA_PAD, 14, 0],
  margin: [-EXTRA_PAD, 0, 0],
  pointerEvents: 'none',
  opacity: 0,
  transform: {
    x: 10,
  },
  isActive: {
    pointerEvents: 'auto',
    opacity: 1,
    transform: {
      x: 0,
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

type Props = CSSPropertySet & {
  store?: DockedPaneStore
  style?: Object
  after?: React.ReactNode
  before?: React.ReactNode
  fadeBottom?: boolean
  name?: string
}

const DockedPaneFrame = view(UI.FullScreen, {
  opacity: 0,
  pointerEvents: 'none',
  isActive: {
    opacity: 1,
    pointerEvents: 'all',
  },
})

const DockedPaneContent = view(UI.View, {
  position: 'relative',
  flex: 1,
  overflow: 'hidden',
})

DockedPaneContent.theme = ({ theme }) => ({
  background: theme.base.background,
})

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
        <DockedPaneContent {...containerStyle}>
          <OverflowFade if={fadeBottom} isInvisible={store.isAtBottom} />
          <Pane
            isActive={store.isActive}
            style={style}
            forwardRef={store.paneRef}
            {...props}
          >
            {children}
          </Pane>
        </DockedPaneContent>
        {after}
      </DockedPaneFrame>
    )
  }
}
