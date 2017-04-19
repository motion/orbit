import { Doc } from 'models'
import { view } from 'helpers'
import { Page } from 'views'
import Router from 'router'
import Editor, { Raw } from 'views/editor'
import { throttle } from 'lodash-decorators'
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
    console.log('focusing editor')
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
          <input
            $title
            value={store.title}
            onChange={e => store.newTitle = e.target.value}
            onKeyDown={e => e.which === 13 && store.focusEditor()}
            onFocus={() => store.editTitle()}
            onBlur={() => store.saveTitle()}
          />
          <editor>
            <Editor
              onRef={ref => store.editorRef = ref}
              content={doc.content}
              onChange={store.update}
            />
          </editor>
        </Page.Main>
      </Page>
    )
  }

  static style = {
    page: {
      maxWidth: 700,
      margin: '30px auto',
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
