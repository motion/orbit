import React from 'react'
import { view, watch } from '@jot/black'
import { User, Document } from '@jot/models'
import { Grid, Button, SlotFill } from '@jot/ui'
import DocumentView from '/views/document'
import { BLOCKS } from '/editor/constants'
import DocItem from '/views/document/item'

const idFn = _ => _

@view({
  store: class DocTileStore {
    document = Document.get(this.props.doc._id)
  },
})
class DocTile {
  render({ store: { document } }) {
    console.log('tile fetch', document)
    return (
      <DocumentView
        if={document}
        inline
        editorProps={{ onlyNode: BLOCKS.UL_LIST }}
        id={document._id}
      />
    )
  }
}

class HomeStore {
  editing = true

  userDoc = watch(() => User.loggedIn && Document.get({ slug: User.user.name }))
  userDocs = watch(() => User.loggedIn && Document.userHomeDocs(User.user.id))

  get layout() {
    if (this.updateVersion === 0) {
      return []
    }
    return User.user.layout
  }

  updateVersion = 0
  updateLayout = async layout => {
    // bullshit react grid calls onLayoutChange on first run
    this.updateVersion++
    if (this.updateVersion === 1) return
    await User.updateInfo({ layout })
  }
}

@view({
  store: HomeStore,
})
export default class HomePage {
  render({ store }) {
    if (!User.loggedIn) {
      return <center $$centered>login plz</center>
    }

    return (
      <home>
        <SlotFill.Fill name="actions">
          <actions>
            <Button
              icon="edit"
              active={store.editing}
              onClick={store.ref('editing').toggle}
            >
              Edit
            </Button>
          </actions>
        </SlotFill.Fill>
        <Grid
          onLayoutChange={store.updateLayout}
          layout={store.layout}
          cols={4}
          rowHeight={150}
          margin={store.editing ? [10, 10] : [0, 0]}
          isDraggable={store.editing}
          isResizable={store.editing}
          items={(store.userDocs || [])
            .map(doc =>
              <DocItem
                key={doc._id || Math.random()}
                draggable
                inline
                bordered={store.editing}
                readOnly={store.editing}
                hideMeta={!store.editing}
                doc={doc}
              />
            )}
        />

        <top if={false}>
          <doc>
            <title>Drafts</title>
            <DocTile if={store.userDoc} doc={store.userDoc} />
          </doc>
        </top>
      </home>
    )
  }

  static style = {
    home: {
      flex: 1,
    },
  }
}
