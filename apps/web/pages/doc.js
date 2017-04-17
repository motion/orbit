import { view } from '~/helpers'
import { Doc } from 'models'
import { Page } from '~/views'
import Router from '~/router'
import Editor from '~/views/editor'

@view.provide({
  store: class {
    doc = Doc.get(Router.params.id)
  },
})
export default class DocPage {
  render() {
    const { store } = this.props
    const [active] = store.doc.current || []

    if (!active) {
      return null
    }

    return (
      <Page>
        <Page.Main>
          {active.title}
          <Editor />
        </Page.Main>
      </Page>
    )
  }
}
