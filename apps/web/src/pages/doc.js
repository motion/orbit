import { Doc } from 'models'
import { view } from 'helpers'
import { Page } from 'views'
import Router from 'router'
import Editor, { Raw } from 'views/editor'
import { throttle } from 'lodash'

@view.provide({
  store: class {
    doc = Doc.get(Router.params.id.replace('-', ':'))
    update = throttle(async val => {
      const [doc] = this.doc.current
      doc.content = Raw.serialize(val)
      doc.save()
    }, 100)
  },
})
export default class DocPage {
  render({ store }) {
    const [active] = store.doc.current || []

    if (!active) {
      return null
    }

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
