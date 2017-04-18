import { Doc } from 'models'
import { view } from 'helpers'
import { Page } from 'views'
import Router from 'router'
import Editor from 'views/editor'
import { debounce } from 'lodash'

@view.provide({
  store: class {
    doc = Doc.get(Router.params.id)
    update = debounce(async val => {
      const doc = await this.doc.promise
      doc.content = val.toJS().document
      console.log('saving as', doc.content)
      doc.save()
    }, 300)
  },
})
export default class DocPage {
  render({ store }) {
    const [active] = store.doc.current || []

    if (!active) {
      return null
    }

    console.log(active.content)
    delete active.key
    delete active.data

    return (
      <Page>
        <Page.Main>
          <h2>Doc: {active.title}</h2>
          <Editor content={active.content} onChange={store.update} />
        </Page.Main>
      </Page>
    )
  }
}
