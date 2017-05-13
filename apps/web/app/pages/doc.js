import { view } from '~/helpers'
import { Page, Button } from '~/ui'
import Router from '~/router'
import DocumentView from '~/views/document'
import { Document } from '@jot/models'

@view({
  store: class DocPageStore {
    doc = Document.get(this.props.id || Router.params.id)
    forceEdit = false

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
        extraActions={[
          <Button tooltip="share link" onClick={() => console.log(place.url())}>
            🔗
          </Button>,
          <Button onClick={doc.togglePrivate}>
            {doc.private ? '🙈' : '🌎'}
          </Button>,
          <Button onClick={store.toggleEdit}>
            {store.editing ? 'done' : 'edit'}
          </Button>,
        ]}
      >
        <DocumentView document={doc} onKeyDown={store.onKeyDown} />
      </Page>
    )
  }
}
