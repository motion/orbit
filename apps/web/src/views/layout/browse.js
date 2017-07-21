import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view.attach('explorerStore')
@view
export default class Browse {
  getChild = child => {
    return (
      <thing key={child.id}>
        <title>
          {child.title}
        </title>
        <children $$paddingLeft={20}>
          {(child.children.length && child.children.map(this.getChild)) || null}
        </children>
      </thing>
    )
  }

  render({ explorerStore, explorerStore: { showBrowse, children } }) {
    return (
      <overlay
        if={showBrowse && children}
        $$fullscreen
        onClick={explorerStore.ref('showBrowse').toggle}
      >
        <UI.Surface $surface width="50%" height="50%" elevation={2}>
          {children.map(this.getChild)}
        </UI.Surface>
      </overlay>
    )
  }

  static style = {
    overlay: {
      position: 'absolute',
      zIndex: 10000000,
      background: [0, 0, 0, 0.1],
    },
    surface: {
      margin: 'auto',
    },
  }
}
