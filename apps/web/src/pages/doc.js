import { Doc } from 'models'
import { view } from 'helpers'
import { Page } from 'views'
import Router from 'router'
import Editor, { Raw } from 'views/editor'
import { throttle } from 'lodash-decorators'
import TimeAgo from 'react-timeago'
import { observable, computed } from 'mobx'

class DocStore {
  docs = Doc.get(Router.params.id.replace('-', ':'))
  editorRef = null

  get doc() {
    return this.docs && this.docs.current && this.docs.current[0]
  }

  @throttle(100)
  update = val => {
    this.doc.content = Raw.serialize(val)
    this.doc.updated_at = new Date().toISOString()
    this.doc.save()
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

@view.provide({
  store: DocStore,
})
export default class DocPage {
  render({ store }) {
    const doc = store.doc

    if (!doc) {
      return null
    }

    return (
      <Page>
        <Page.Main $page>
          <top>
            <input
              $title
              value={store.title}
              onChange={e => store.newTitle = e.target.value}
              onKeyDown={e => e.which === 13 && store.focusEditor()}
              onFocus={() => store.editTitle()}
              onBlur={() => store.saveTitle()}
            />
            <ago>
              <span>last edited </span>
              <TimeAgo minPeriod={20} date={doc.updated_at} />
            </ago>
          </top>
          <editor>
            <Editor
              onRef={ref => store.editorRef = ref}
              content={doc.content}
              onChange={store.update}
            />
          </editor>
          <places if={doc.places}>
            belongs to places:
            {doc.places.map(name => <place key={name}>{name}</place>)}
          </places>
        </Page.Main>
      </Page>
    )
  }

  static style = {
    page: {
      maxWidth: 700,
      margin: '30px auto',
    },
    top: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    ago: {
      flexFlow: 'row',
    },
    title: {
      fontSize: 24,
      border: 'none',
      padding: 0,
      width: '100%',
    },
    editor: {
      marginTop: 20,
    },
  }
}
