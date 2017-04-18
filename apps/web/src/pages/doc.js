import { Doc } from 'models'
import { view } from 'helpers'
import { Page } from 'views'
import Router from 'router'
import Editor, { Raw } from 'views/editor'
import { debounce } from 'lodash'

@view.provide({
  store: class {
    doc = Doc.get(Router.params.id)
    update = debounce(async val => {
      const doc = await this.doc.promise
      console.log('saving doc', doc._id)
      doc.content = Raw.serialize(val)
      doc.save()
    }, 300)
  },
})
export default class DocPage {
  render({ store }) {
    const [active] = store.doc.current || []

    window.s = store

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
