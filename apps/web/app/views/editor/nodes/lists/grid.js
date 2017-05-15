import { view } from '~/helpers'
import { Grid } from '~/ui'
import DocItem from '~/views/document/item'

@view({
  store: class {
    get place() {
      return this.props.place
    }
    updateLayout(layout) {
      if (this.place && !isEqual(this.place.layout, layout)) {
        this.place.layout = layout
        this.place.save()
      }
    }
  },
})
export default class GridList {
  render({ store, listStore }) {
    return (
      <grid>
        <Grid
          if={listStore.docs}
          onLayoutChange={store.updateLayout}
          layout={listStore.place.layout}
          cols={2}
          rowHeight={200}
          items={listStore.docs.map(doc => (
            <DocItem slanty draggable editable key={doc._id} doc={doc} />
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
