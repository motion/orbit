import { view } from '~/helpers'
import { Grid } from '~/ui'
import DocItem from '~/views/document/item'

@view({
  store: class GridListStore {
    updateLayout(layout) {
      const { node } = this.props
      const next = node.data.set('layout', layout)
      this.props.onChange(next)
    }
  },
})
export default class GridList {
  render({ node, store, listStore }) {
    return (
      <grid>
        <Grid
          onLayoutChange={store.updateLayout}
          layout={node.data.get('layout')}
          cols={4}
          rowHeight={150}
          items={(listStore.docs || [])
            .map(doc => (
              <DocItem bordered draggable editable key={doc._id} doc={doc} />
            ))}
        />
      </grid>
    )
  }
  static style = {
    grid: {
      margin: [0, -15],
    },
  }
}
