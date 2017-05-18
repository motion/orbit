import { view } from '~/helpers'
import { Button, Icon } from '~/ui'
import randomcolor from 'random-color'

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
      <docs>
        {(listStore.docs || []).map((doc, i) => (
          <item key={doc._id}>
            <before>
              <Icon name="minimal-up" iconSize={12} />
              <Icon name="minimal-down" iconSize={12} />
            </before>
            <content>
              <title>{doc.title.trim() || 'Lorem ipsum'}</title>
              <below>
                <Icon name="link" size={12} color={[0, 0, 0, 0.5]} />
              </below>
            </content>
          </item>
        ))}
      </docs>
    )
  }

  static style = {
    docs: {},
    item: {
      flexFlow: 'row',
      margin: [0, 0, 10, 0],
    },
    before: {
      width: 50,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 30,
    },
    below: {
      fontSize: 12,
      opacity: 0.5,
    },
  }
}
