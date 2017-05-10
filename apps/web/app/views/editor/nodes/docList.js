import { node, view } from '~/helpers'
import { Document } from 'models'
import { toJS } from 'mobx'
import { isArray } from 'lodash'
import randomcolor from 'random-color'
import Router from '~/router'

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
        <docs $stack={true} if={hasDocs}>
          {store.docs.map((doc, i) => (
            <doc
              $$background={`
                linear-gradient(
                  ${Math.floor(Math.random() * 180)}deg,
                  ${randomcolor().hexString()},
                  ${randomcolor().hexString()}
                )
              `}
              $first={i === 0}
              key={doc._id}
              onClick={() => Router.go(doc.url())}
            >
              <card $$title>
                {doc.getTitle()}
              </card>
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
      overflowX: 'scroll',
      padding: 10,
      margin: [0, -10],
    },
    doc: {
      margin: [0, 10, 0, 0],
      userSelect: 'none',
      width: 150,
      height: 150,
      borderBottom: [1, '#eee'],
      color: '#fff',
      fontWeight: 800,
      cursor: 'pointer',
      fontSize: 46,
      lineHeight: '3rem',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: '0 0 10px rgba(0,0,0,0.02)',
        zIndex: 1000,
        transform: 'rotate(-3deg)',
      },
    },
    card: {
      // background: '#fff',
      width: '100%',
      height: '100%',
    },
    stack: {
      flexFlow: 'row',
    },
  }
}
