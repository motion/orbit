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
      console.log('grid change layout', node.data)
      this.props.onChange(next)
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
          items={(listStore.docs || [])
            .map(doc => (
              <DocItem
                key={doc._id.replace(':', '') || Math.random()}
                draggable
                bordered={store.editing}
                readOnly={!store.editing}
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
