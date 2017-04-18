import { Doc } from 'models'
import { view } from 'helpers'
import { Page } from 'views'
import Router from 'router'
import Editor from 'views/editor'

@view.provide({
  store: class {
    doc = Doc.get(Router.params.id)
  },
})
export default class DocPage {
  render({ store }) {
    const [active] = store.doc.current || []

    return (
      <Page if={active}>
        <Page.Main>
          {active.title}
          <Editor />
        </Page.Main>
      </Page>
    )
  }
}
