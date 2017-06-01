import React from 'react'
import { view } from '~/helpers'
import { Grid, Button } from '~/ui'
import DocItem from '~/views/document/item'

@view({
  store: class GridListStore {
    editing = false

    updateLayout(layout) {
      const { node } = this.props
      const next = node.data.set('layout', layout)
      this.props.setData(next)
    }

    toggleEdit = () => {
      this.editing = !this.editing
    }
  },
})
export default class GridList {
  render({ node, store, listStore }) {
    return (
      <grid>
        <Button onClick={store.toggleEdit}>toggle edit</Button>
        <Grid
          onLayoutChange={store.updateLayout}
          layout={node.data.get('layout')}
          cols={4}
          rowHeight={150}
          margin={store.editing ? [10, 10] : [0, 0]}
          isDraggable={store.editing}
          isResizable={store.editing}
          items={(listStore.docs || [])
            .map(doc => (
              <DocItem
                key={doc._id || Math.random()}
                draggable
                inline
                bordered={store.editing}
                readOnly={store.editing}
                hideMeta={!store.editing}
                doc={doc}
              />
            ))}
        />
      </grid>
    )
  }
  static style = {
    grid: {
      margin: 0,
    },
  }
}
