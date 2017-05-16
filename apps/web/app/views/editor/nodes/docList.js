import { node, view } from '~/helpers'
import App, { Document } from '@jot/models'
import { Button } from '~/ui'
import { isEqual } from 'lodash'
import Router from '~/router'
import CardList from './lists/card'
import GridList from './lists/grid'

class DocListStore {
  nextDoc = Document.create({ temporary: true, authorId: 'anon' })

  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  docs = !this.props.editorStore.inline &&
    Document.forPlace(this.place && this.place.slug)

  get place() {
    return App.activePage.place
  }
  setType = (node, listType: string) => {
    const next = node.data.set('listType', listType)
    this.props.onChange(next)
  }
}

@view({
  store: DocListStore,
})
export default class DocList {
  render({ node, editorStore, store, children, ...props }) {
    const hasLoaded = !!store.docs
    const hasDocs = hasLoaded && store.docs.length > 0
    const listType = node.data.get('listType') || 'card'

    return (
      <doclist contentEditable={false}>
        <config>
          <buttons>
            <Button
              $active={listType === 'grid'}
              onClick={() => store.setType(node, 'grid')}
            >
              ⊞
            </Button>
            <Button
              $active={listType === 'card'}
              onClick={() => store.setType(node, 'card')}
            >
              🃏
            </Button>
          </buttons>
        </config>
        <content>
          <CardList if={listType === 'card'} listStore={store} />
          <GridList if={listType === 'grid'} listStore={store} />
        </content>
      </doclist>
    )
  }

  static style = {
    doclist: {
      position: 'relative',
    },
    config: {
      position: 'absolute',
      top: 0,
      right: 0,
      overflow: 'hidden',
    },
    card: {
      // background: '#fff',
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttons: {
      flexFlow: 'row',
    },
    active: {
      background: 'red',
      color: '#fff',
    },
  }
}
