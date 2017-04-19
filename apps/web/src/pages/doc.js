import { Doc } from 'models'
import { view } from 'helpers'
import { Page } from 'views'
import Router from 'router'
import Editor, { Raw } from 'views/editor'
import { throttle } from 'lodash-decorators'

class DocStore {
  docs = Doc.get(Router.params.id.replace('-', ':'))
  get doc() {
    return this.docs && this.docs.current && this.docs.current[0]
  }
  @throttle(100)
  update = val => {
    this.doc.content = Raw.serialize(val)
    this.doc.save()
  }
  editTitle = () => {
    this.doc.title = this.title.innerHTML
    this.doc.save()
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
        <Page.Main>
          <h2>
            Doc:
            {' '}
            <title
              ref={ref => store.title = ref}
              contentEditable
              onInput={store.editTitle}
            >
              {doc.title}
            </title>
          </h2>
          <Editor content={doc.content} onChange={store.update} />
        </Page.Main>
      </Page>
    )
  }
}
