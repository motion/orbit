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

  render({ explorerStore: { showBrowse, children } }) {
    return (
      <UI.Surface $browse elevation={2} if={showBrowse && children}>
        {children.map(this.getChild)}
      </UI.Surface>
    )
  }

  static style = {
    browse: {
      position: 'absolute',
      top: '20%',
      right: '20%',
      bottom: '20%',
      left: '20%',
      zIndex: 1000,
    },
  }
}
