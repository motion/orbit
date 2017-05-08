import { view } from '~/helpers'
import { Page, Button } from '~/views'
import Router from '~/router'
import TimeAgo from 'react-timeago'
import Editor from '~/views/editor'
import { Document } from 'models'

@view({
  store: class PageStore {
    doc = Document.get(this.props.id)
    editing = false

    toggleEdit = () => {
      this.editing = !this.editing
    }
  },
})
export default class DocumentPage {
  render({ store, noSide }) {
    const { doc } = store

    if (!doc) {
      return null
    }

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
              <Editor readOnly={!store.editing} id={doc._id} />
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
