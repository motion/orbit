import { view, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Grid from '~/views/grid'

class BoardStore {
  placeFromId = this.props.placeId && Place.get(this.props.placeId)
  docs = Document.forPlace(this.props.placeId)

  get place() {
    return this.props.place || this.placeFromId.current
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
    return (
      <Grid
        onLayoutChange={store.updateLayout}
        layout={store.place.layout}
        cols={2}
        rowHeight={200}
        items={(store.docs.current || [])
          .map(doc => (
            <DocItem
              slanty
              draggable
              editable
              onClick={store.setActive(doc)}
              doc={doc}
            />
          ))}
      />
    )
  }
}
