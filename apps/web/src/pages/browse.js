import { view } from '@mcro/black'
import Page from '~/views/page'

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

  render({ explorerStore }) {
    return (
      <Page>
        {explorerStore.children && explorerStore.children.map(this.getChild)}
      </Page>
    )
  }
}
