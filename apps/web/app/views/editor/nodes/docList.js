import { node, view } from '~/helpers'
import App, { Document } from 'models'
import { Button } from '~/views'
import { isEqual } from 'lodash'
import randomcolor from 'random-color'
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
        <h4>
          Recent Posts
          {' '}
          <Button onClick={() => store.setType(node, 'grid')}>grid</Button>
        </h4>
        <docs if={!hasDocs}>
          no docs!
        </docs>
        <content if={hasDocs}>
          <CardList if={!listType} listStore={store} />
          <GridList if={listType === 'grid'} listStore={store} />
        </content>
      </doclist>
    )
  }
}
