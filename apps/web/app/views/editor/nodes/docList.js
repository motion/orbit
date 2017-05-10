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
            <doc key={doc._id} onClick={() => doc.routeTo()}>
              {doc.getTitle()}
            </doc>
          ))}
        </docs>
        <noDocs if={hasLoaded && !hasDocs}>No recent documents</noDocs>
      </container>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      margin: 20,
    },
    doc: {
      margin: 10,
      width: 300,
      background: 'white',
      userSelect: 'none',
      boxShadow: `0 0 0 1px rgba(99,114,130,0.16), 0 2px 16px rgba(27,39,51,0.08)`,
      borderRadius: 3,
      border: '1px solid #eee',
      padding: 20,
      color: '#6f7c82',
      fontWeight: 400,
      transition: '150ms all ease-in',
      cursor: 'pointer',
      fontSize: 16,
      '&:hover': {
        boxShadow: `0 0 0 1px rgba(99,114,130,0.36), 0 2px 16px rgba(27,39,51,0.28)`,
        background: '#fefefe',
      },
    },
  }
}
