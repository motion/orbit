import { Doc } from 'models'
import { view } from '~/helpers'
import { Page } from '~/views'
import Router from '~/router'
import Editor, { Raw } from '~/views/editor'
import TimeAgo from 'react-timeago'
import { observable, computed } from 'mobx'

class DocumentStore {
  start(id) {
    this.docs = Doc.get(id)
  }

  editorRef = null

  get doc() {
    return this.docs && this.docs.current
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
  store: DocumentStore,
})
export default class Document {
  home = ({ which }) => {
    if (which === 27) {
      Router.go('/')
    }
  }

  componentWillMount() {
    this.props.store.start(this.props.id)
    document.addEventListener('keydown', this.home)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.home)
  }

  render({ store, noSide }) {
    const doc = store.doc

    if (!doc) {
      return null
    }

    return (
      <document>
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
      </document>
    )
  }

  static style = {
    top: {
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 28,
      border: 'none',
      margin: [10, -1],
      width: '100%',
    },
  }
}
