import { node, view } from '~/helpers'
import App, { Document } from 'models'
import { Button } from '~/views'
import { isEqual } from 'lodash'
import Router from '~/router'
import CardList from './lists/card'
import GridList from './lists/grid'

class DocListStore {
  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  docs = !this.props.editorStore.inline &&
    Document.forPlace(this.place && this.place.slug)

  get place() {
    return App.activePage.place
  }
  setType = (node, listType: string) => {
    console.log('set type')
    const next = node.data.set('listType', listType)
    this.props.onChange(next)
  }
}

@node
@view({
  store: DocListStore,
})
export default class DocList {
  render({ node, editorStore, store, children, ...props }) {
    const hasLoaded = !!store.docs
    const hasDocs = hasLoaded && store.docs.length > 0
    const listType = node.data.get('listType')

    return (
      <doclist contentEditable={false}>
        <title>
          <span $title>Recent Posts</span>
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
        </title>
        <docs if={!hasDocs}>
          no docs!
        </docs>
        <content if={hasDocs}>
          <CardList if={listType === 'card'} listStore={store} />
          <GridList if={listType === 'grid'} listStore={store} />
        </content>
      </doclist>
    )
  }

  static style = {
    title: {
      flexFlow: 'row',
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
