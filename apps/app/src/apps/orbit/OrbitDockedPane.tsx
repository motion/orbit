import * as React from 'react'
import { view, on, react } from '@mcro/black'
import * as _ from 'lodash'
import { BORDER_RADIUS } from '../../constants'
import * as UI from '@mcro/ui'

const EXTRA_PAD = 40

class DockedPaneStore {
  paneRef = React.createRef()
  isAtBottom = false

  didMount() {
    on(
      this,
      this.paneRef.current,
      'scroll',
      _.throttle(this.setOverflow, 16 * 3),
    )
    const observer = new MutationObserver(this.setOverflow)
    observer.observe(this.paneRef.current, { childList: true })
    on(this, observer)
  }

  scrollToSelectedCard = react(
    () => this.props.appStore.selectedCardRef,
    cardRef => {
      if (!this.isActive) {
        throw react.cancel
      }
      // cardRef.scrollIntoViewIfNeeded()
      // const frameBottom = this.paneRef.current.clientHeight
      // const cardBottom = cardRef.offsetTop + cardRef.clientHeight
      // if (cardBottom <= frameBottom) {
      //   throw react.cancel
      // }
      // this.paneRef.current.scrollTop = cardBottom - frameBottom + EXTRA_PAD
    },
    {
      immediate: true,
    },
  )

  setOverflow = () => {
    const node = this.paneRef.current
    if (!node) {
      return
    }
    const lastNode = _.last(Array.from(node.children))
    if (!lastNode) {
      return
    }
    const innerHeight = lastNode.offsetTop + lastNode.clientHeight
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

type Props = {
  store: DockedPaneStore
  style?: Object
  after?: React.ReactNode
  fadeBottom?: boolean
  name?: string
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
      ...props
    } = this.props
    log(`${name} ${store.isAtBottom} -- render docked pane`)
    return (
      <>
        <OverflowFade if={fadeBottom} isInvisible={store.isAtBottom} />
        <Pane
          isActive={store.isActive}
          style={style}
          forwardRef={store.paneRef}
          {...props}
        >
          {children}
        </Pane>
        {after}
      </>
    )
  }
}
