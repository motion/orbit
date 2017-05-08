import { view } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Grid from '~/views/grid'

@view({
  store: class {
    place = Place.get(this.props.slug)
    docs = Document.forPlace(this.props.slug)
    updateLayout(layout) {
      if (!isEqual(this.place.layout, layout)) {
        this.place.layout = layout
        this.place.save()
      }
    }
  },
})
export default class Board {
  render({ store }) {
    if (!store.docs || !store.docs.length) {
      return <null>no docs found</null>
    }

    const docs = store.docs.map(doc => {
      return <DocItem slanty draggable editable key={doc._id} doc={doc} />
    })

    return (
      <Grid
        if={store.place}
        onLayoutChange={store.updateLayout}
        layout={store.place.layout}
        cols={2}
        rowHeight={200}
        items={docs}
      />
    )
  }
}
