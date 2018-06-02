import * as React from 'react'
import { view } from '@mcro/black'

class DockedPaneStore {
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
  render({ name, children, store, style }) {
    log(`dockedpane active ${name} ${store.isActive}`)
    return (
      <pane $isActive={store.isActive} style={style}>
        {children}
      </pane>
    )
  }

  static style = {
    pane: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transition: 'all ease-in-out 150ms',
      overflowY: 'scroll',
      padding: [40, 8],
      margin: [-40, 0],
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
  }

  // static theme = (props, theme) => {
  //   return {
  //     pane: {
  //       background: theme.base.background,
  //     },
  //   }
  // }
}
