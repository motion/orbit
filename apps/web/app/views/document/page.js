import { view } from '~/helpers'
import { Page, Button } from '~/views'
import Router from '~/router'
import TimeAgo from 'react-timeago'
import Editor from '~/views/editor'
import { Document } from 'models'

// cmd + t
// cmd+t
@view({
  store: class PageStore {
    doc = Document.get(this.props.id)
    editor = null
    forceEdit = false

    start() {
      window.x = this
      this.watch(() => {
        console.log(this.doc && this.doc.private)
      })
    }

    onKeyDown = e => {
      if (!e.metaKey || e.which !== 84) return
      this.editor.blur()
      setTimeout(() => {
        window._toggleCommander()
      })
    }

    get editing() {
      return this.forceEdit || (App.loggedIn && !App.user.hatesToEdit)
    }

    toggleEdit = () => {
      this.forceEdit = !this.forceEdit
    }
  },
})
export default class DocumentPage {
  render({ store, noActions, noSide }) {
    const { doc } = store

    if (!doc) {
      return null
    }

    console.log('r', store.doc)

    return (
      <Page
        header
        sidebar={
          <side $$flex>
            side ;alala
          </side>
        }
        actions={[
          <Button>🔗</Button>,
          <Button onClick={doc.togglePrivate}>
            {doc.private ? '🙈' : '🌎'}
          </Button>,
          <Button onClick={store.toggleEdit}>
            {store.editing ? 'done' : 'edit'}
          </Button>,
        ]}
      >
        <content $$flex $$row>
          <main $$flex={2}>
            <docarea $$draggable>
              <Button onClick={doc.togglePrivate}>
                {doc.private ? '🙈' : '🌎'}
              </Button>
              <Editor
                onKeyDown={store.onKeyDown}
                doc={doc}
                readOnly={!store.editing}
                getRef={el => {
                  store.editor = el
                }}
                id={doc._id}
              />
            </docarea>

            <met>
              <ago>
                <TimeAgo if={false} minPeriod={20} date={doc.updatedAt} />
              </ago>
              <places $$row if={doc.places}>
                places:
                {(doc.places || [])
                  .map(name => <place key={name}>{name}</place>)}
              </places>
            </met>
          </main>
        </content>
      </Page>
    )
  }

  static style = {
    ago: {
      flexFlow: 'row',
    },
    main: {
      padding: 15,
      position: 'relative',
    },
    met: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    docarea: {
      flex: 1,
    },
  }
}
