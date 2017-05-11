import { node, view } from '~/helpers'
import App, { Document } from 'models'
import { Button } from '~/views'
import randomcolor from 'random-color'
import Router from '~/router'
import Grid from '~/views/grid'
import DocItem from '~/views/document/item'

@view class CardList {
  render({ listStore }) {
    return (
      <docs $stack={true} if={listStore.docs}>
        {listStore.docs.map((doc, i) => (
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

@view({
  store: class {
    get place() {
      return this.props.place
    }
    updateLayout(layout) {
      if (!isEqual(this.place.layout, layout)) {
        this.place.layout = layout
        this.place.save()
      }
    }
  },
})
class GridList {
  render({ store, listStore }) {
    return (
      <Grid
        if={listStore.docs}
        onLayoutChange={store.updateLayout}
        layout={listStore.place.layout}
        cols={2}
        rowHeight={200}
        items={listStore.docs.map(doc => (
          <DocItem slanty draggable editable key={doc._id} doc={doc} />
        ))}
      />
    )
  }
}

class DocListStore {
  docs = Document.forPlace(this.place && this.place.slug)
  get place() {
    return App.activePage.place
  }
  setType = (node, listType: string) => {
    const next = node.data.set('listType', listType)
    this.props.onChange(next)
  }
}

@node
@view({
  store: DocListStore,
})
export default class DocList {
  render({ node, store, children, ...props }) {
    const hasLoaded = !!store.docs
    const hasDocs = hasLoaded && store.docs.length > 0
    const listType = node.data.get('listType')
    console.log('got type', listType)

    return (
      <container contentEditable={false}>
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
      </container>
    )
  }
}
