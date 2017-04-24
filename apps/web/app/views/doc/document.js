import { view } from '~/helpers'
import { Page } from '~/views'
import Router from '~/router'
import Editor, { Raw } from '~/views/editor'
import TimeAgo from 'react-timeago'
import DocumentStore from './store'

@view({
  store: DocumentStore,
})
export default class Document {
  onKey = ({ which }) => {
    if (which === 27) {
      Router.go('/')
    }
  }

  componentWillMount() {
    this.props.store.start(this.props.id || this.props.doc._id)
    this.addEvent(document, 'keydown', this.onKey)
  }

  render({ store, noSide }) {
    const doc = store.doc

    if (!doc) {
      return null
    }

    return (
      <document $$undraggable>
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
