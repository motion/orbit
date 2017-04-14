import { view } from '~/helpers'
import { Doc } from 'models'
import { Page } from '~/views'
import Router from '~/router'
import Editor, { stateFromText } from '~/views/editor'

@view.provide({
  store: class {
    doc = Doc.get(Router.params.id)
    content = stateFromText('this is a cool editor... 🏀')
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
          {active.title}

          <Editor
            editorState={store.state}
            placeholder='Text'
            onChange={state => store.content = state}
          />
        </Page.Main>
      </Page>
    )
  }
}
