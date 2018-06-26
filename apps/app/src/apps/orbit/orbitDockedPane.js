import * as React from 'react'
import { view } from '@mcro/black'
import * as _ from 'lodash'

class DockedPaneStore {
  paneRef = React.createRef()
  isAtBottom = false

  didMount() {
    this.on(this.paneRef.current, 'scroll', _.throttle(this.setOverflow, 100))
    const observer = new MutationObserver(this.setOverflow)
    observer.observe(this.paneRef.current, { childList: true })
    this.subscriptions.add({
      dispose: () => observer.disconnect(),
    })
  }

  setOverflow = () => {
    const node = this.paneRef.current
    const lastNode = _.last(Array.from(node.children))
    const innerHeight = lastNode.offsetTop + lastNode.clientHeight
    const scrolledTo = node.scrollTop + node.clientHeight
    if (scrolledTo === innerHeight) {
      this.isAtBottom = true
    } else {
      this.isAtBottom = false
    }
  }

  // prevents uncessary and expensive OrbitCard re-renders
  get isActive() {
    const { extraCondition, name, paneStore } = this.props
    return (
      name === paneStore.activePane &&
      (extraCondition ? extraCondition() : true)
    )
  }
}

@view.attach('paneStore')
@view({
  store: DockedPaneStore,
})
export class OrbitDockedPane {
  render({ children, store, style, after, fadeBottom }) {
    return (
      <>
        <overflowFade
          if={fadeBottom}
          $invisible={store.isAtBottom || !store.isActive}
        />
        <pane $isActive={store.isActive} style={style} ref={store.paneRef}>
          {children}
        </pane>
        {after}
      </>
    )
  }

  static style = {
    pane: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transition: 'all ease-in-out 100ms',
      overflowY: 'scroll',
      padding: [40, 14, 0],
      margin: [-40, 0, 0],
      pointerEvents: 'none',
      opacity: 0,
      transform: {
        x: 10,
      },
    },
    isActive: {
      pointerEvents: 'auto',
      opacity: 1,
      transform: {
        x: 0,
      },
    },
    overflowFade: {
      pointerEvents: 'none',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      zIndex: 10000000,
      borderRadius: 20,
      overflow: 'hidden',
      opacity: 1,
      transition: 'all ease-in 250ms',
    },
    invisible: {
      opacity: 0,
    },
  }

  static theme = (_, theme) => {
    return {
      overflowFade: {
        background: `linear-gradient(transparent, ${theme.base.background})`,
      },
    }
  }
}
