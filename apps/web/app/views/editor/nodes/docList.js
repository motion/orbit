import { node, view } from '~/helpers'
import { Document } from 'models'
import { toJS } from 'mobx'
import { isArray } from 'lodash'

class ListStore {
  docs = Document.forPlace(window.Editor.doc.places[0])
}

@node
@view({
  store: ListStore,
})
export default class Todo {
  render({ node, store, children, ...props }) {
    const { data } = node

    const hasLoaded = isArray(toJS(store.docs))
    const hasDocs = hasLoaded && store.docs.length > 0

    return (
      <container contentEditable={false}>
        <h4>Recent Posts</h4>
        <docs if={hasDocs}>
          {store.docs.map(doc => (
            <doc onClick={() => doc.routeTo()}>{doc.getTitle()}</doc>
          ))}
        </docs>
        <noDocs if={hasLoaded}>No recent documents</noDocs>
      </container>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      margin: 20,
    },
    doc: {
      marginRight: 20,
      background: 'white',
      border: '1px solid #eee',
      padding: 20,
    },
  }
}
