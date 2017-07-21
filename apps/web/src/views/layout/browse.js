import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Router from '~/router'
import fuzzy from 'fuzzy'

class BrowseStore {
  filter = ''

  get children() {
    return this.props.explorerStore.children
  }

  get filteredChildren() {
    if (!this.children) {
      return []
    }
    return fuzzy
      .filter(this.filter, this.children, {
        extract: el => el.title,
        pre: '<',
        post: '>',
      })
      .map(item => item.original)
  }
}

@view.attach('explorerStore')
@view({
  store: BrowseStore,
})
export default class Browse {
  onClick = child => () => {
    Router.go(child.url())
    this.props.explorerStore.ref('showBrowse').toggle()
  }

  getChild = child => {
    return (
      <UI.ListItem
        size={1}
        primary={
          <item
            css={{
              padding: [5, 10],
              '&:hover': {
                background: '#eee',
              },
            }}
            onClick={this.onClick(child)}
          >
            {child.title || ''}
          </item>
        }
        key={child.id}
        height="auto"
        padding={0}
        glow={false}
      >
        <children $$paddingLeft={20}>
          {(child.children.length && child.children.map(this.getChild)) || null}
        </children>
      </UI.ListItem>
    )
  }

  render({ explorerStore, store }) {
    return (
      <browse $$fullscreen if={explorerStore.showBrowse}>
        <overlay
          $$fullscreen
          onClick={explorerStore.ref('showBrowse').toggle}
        />
        <UI.Surface $surface width="50%" height="50%" elevation={2}>
          <UI.Input
            height={30}
            flex="none"
            onChange={e => store.ref('filter').set(e.target.value)}
          />
          <content if={store.filteredChildren}>
            {store.filteredChildren.map(this.getChild)}
          </content>
        </UI.Surface>
      </browse>
    )
  }

  static style = {
    browse: {
      position: 'absolute',
      zIndex: 10000000,
    },
    overlay: {
      background: [0, 0, 0, 0.1],
    },
    surface: {
      margin: 'auto',
      padding: 10,
      borderRadius: 5,
    },
    content: {
      flex: 1,
      overflowY: 'auto',
    },
  }
}
