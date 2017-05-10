import { view } from '~/helpers'
import { Page, Button } from '~/views'
import Router from '~/router'
import TimeAgo from 'react-timeago'
import Editor from '~/views/editor'
import { Document } from 'models'

// cmd + t
@view({
  store: class DocPageStore {
    doc = Document.get(this.props.id || Router.params.id)
    editor = null
    forceEdit = false

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
  render({ store }) {
    const { doc } = store

    if (!doc) {
      return null
    }

    return (
      <Page
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
            <docarea>
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
                <TimeAgo minPeriod={20} date={doc.updatedAt} />
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
