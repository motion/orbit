import { Doc } from 'models'
import { view } from '~/helpers'
import { Page } from '~/views'
import Router from '~/router'
import Editor, { Raw } from '~/views/editor'
import TimeAgo from 'react-timeago'
import { observable, computed } from 'mobx'

class DocStore {
  start(id) {
    this.docs = Doc.get(id)
  }

  editorRef = null

  get doc() {
    return this.docs && this.docs.current && this.docs.current[0]
  }

  @observable editingTitle = false
  @observable newTitle = ''

  @computed get title() {
    return this.editingTitle ? this.newTitle : this.doc.title
  }

  editTitle = () => {
    this.newTitle = this.doc.title
    this.editingTitle = true
  }

  saveTitle = () => {
    this.doc.title = this.newTitle
    this.doc.save()
    this.editingTitle = false
  }

  focusEditor = () => {
    this.editorRef.focus()
  }
}

@view({
  store: DocStore,
})
export default class DocPage {
  componentWillMount() {
    this.props.store.start(this.props.id)
  }

  render({ store }) {
    const doc = store.doc

    if (!doc) {
      return null
    }

    return (
      <Page>
        <Page.Main>
          <top>
            <input
              $title
              value={store.title}
              onChange={e => store.newTitle = e.target.value}
              onKeyDown={e => e.which === 13 && store.focusEditor()}
              onFocus={() => store.editTitle()}
              onBlur={() => store.saveTitle()}
            />
          </top>
          <editor>
            <Editor ref={ref => store.editorRef = ref} doc={doc} />
          </editor>
        </Page.Main>

        <Page.Side>
          <ago>
            <span>last edited </span>
            <TimeAgo minPeriod={20} date={doc.updated_at} />
          </ago>
          <places if={doc.places}>
            belongs to places:
            {doc.places.map(name => <place key={name}>{name}</place>)}
          </places>
        </Page.Side>
      </Page>
    )
  }

  static style = {
    top: {
      justifyContent: 'space-between',
    },
    ago: {
      flexFlow: 'row',
    },
    title: {
      fontSize: 28,
      border: 'none',
      margin: [10, -1],
      width: '100%',
    },
  }
}
