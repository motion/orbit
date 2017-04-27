import { view } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Grid from '~/views/grid'

class BoardStore {
  place = Place.get(this.props.slug)
  docs = Document.forPlace(this.place)

  updateLayout = layout => {
    const { current } = this.place
    if (!isEqual(current.layout, layout)) {
      current.layout = layout
      current.save()
    }
  }
}

@view({
  store: BoardStore,
})
export default class Board {
  render({ store }) {
    const docs = (store.docs.current || [])
      .map(doc => <DocItem slanty draggable editable key={doc._id} doc={doc} />)

    return (
      <Grid
        if={store.place.current}
        onLayoutChange={store.updateLayout}
        layout={store.place.current.layout}
        cols={2}
        rowHeight={200}
        items={docs}
      />
    )
  }
}
