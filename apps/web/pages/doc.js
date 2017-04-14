import { view } from '~/helpers'
import { Doc } from 'models'
import { Page } from '~/views'
import Router from '~/router'

class DocStore {
  doc = Doc.get(Router.params.name)
}

@view.provide({
  store: DocStore,
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
          {active.title}
        </Page.Main>
      </Page>
    )
  }
}

