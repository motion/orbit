import { view } from '~/helpers'
import randomcolor from 'random-color'
import DocItem from '~/views/document/item'

@view
export default class CardList {
  render({ listStore }) {
    return (
      <docs $stack={true}>
        <DocItem $doc editable if={listStore.nextDoc} doc={listStore.nextDoc} />
        {(listStore.docs || [])
          .map((doc, i) => <DocItem $doc editable key={doc._id} doc={doc} />)}
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
      width: 200,
      height: 280,
      overflow: 'hidden',
      borderTop: [2, 'red'],
      '&:hover': {
        transform: { rotate: '-0.5deg' },
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
