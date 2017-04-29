import { view } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Grid from '~/views/grid'

class BoardStore {
  place = Place.get(this.props.slug)
  docs = Document.forPlace(this.place)

  updateLayout = layout => {
    if (!isEqual(this.place.layout, layout)) {
      this.place.layout = layout
      this.place.save()
    }
  }
}

@view({
  store: BoardStore,
})
export default class Board {
  render({ store }) {
    const docs = (store.docs || []).map(doc => {
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
