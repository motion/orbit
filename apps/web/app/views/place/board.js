import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Grid from '~/views/grid'

class BoardStore {
  constructor(props) {
    this._place = props.place || Place.get(this.props.placeSlug)
    this.docs = Document.forPlace(this.place)
  }

  get place() {
    return this._place.current || this._place
  }

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
    const docs = (store.docs.current || [])
      .map(doc => <DocItem slanty draggable editable key={doc._id} doc={doc} />)

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
