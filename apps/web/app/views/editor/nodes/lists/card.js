import { view } from '~/helpers'
import { Icon } from '~/ui'
import randomcolor from 'random-color'
import DocItem from '~/views/document/item'

@view
export default class CardList {
  docRef = (node, index) => {
    if (this.props.shouldFocus && node && index === 0) {
      node.focus()
      this.props.listStore.doneFocusing()
    }
  }

  render({ listStore }) {
    return (
      <docs $stack={true}>
        <doc $temp $$centered onClick={listStore.createDoc}>
          <Icon name="uiadd" />
        </doc>
        {(listStore.docs || [])
          .map((doc, i) => (
            <DocItem
              $doc
              editable
              key={doc._id}
              ref={node => this.docRef(node, i)}
              doc={doc}
            />
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
      width: 200,
      height: 280,
      borderRadius: 5,
      overflow: 'hidden',
      '&:hover': {
        transform: { rotate: '-0.5deg' },
      },
    },
    temp: {
      background: '#fafafa',
      cursor: 'pointer',
      width: 40,
      '&:hover': {
        background: '#f2f2f2',
      },
    },
    stack: {
      flexFlow: 'row',
    },
  }
}
