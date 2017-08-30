import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { includes } from 'lodash'
import Actions from './actions'

@view.attach('paneStore')
@view
export default class Selectable {
  componentWillMount() {
    const { paneStore, options } = this.props
    paneStore.addCard(options)
  }

  componentWillUnmount() {
    const { paneStore, options } = this.props
    paneStore.removeCard(options)
  }

  render({ paneStore, options }) {
    const { name, when, body, actions, index, id } = options
    const { selectedIds } = paneStore
    const isActive = paneStore.getActiveIndex() === index
    const isSelected = includes(selectedIds, id)
    const showActions = isActive && selectedIds.length === 0

    return (
      <card
        onClick={() => {
          paneStore.setIndex(index)
        }}
        $active={isActive}
        $selected={isSelected}
      >
        <top $$row>
          <item $$row>
            <input
              type="checkbox"
              onChange={() => paneStore.toggleId(id)}
              checked={isSelected}
            />
            <name>
              {name}
            </name>
          </item>
          <when>
            {when}
          </when>
        </top>
        <content $$row>
          {body}
        </content>
        <Actions if={showActions} id={id} actions={actions} />
      </card>
    )
  }

  static style = {
    card: {
      padding: 20,
    },
    p: {
      width: '95%',
      marginLeft: 20,
    },
    content: {
      padding: 15,
      alignItems: 'center',
    },
    input: {
      alignSelf: 'center',
    },
    active: {
      background: '#aaa',
    },
    top: {
      justifyContent: 'space-between',
    },
    name: {
      marginLeft: 5,
      fontSize: 14,
      textTransform: 'capitalize',
      fontWeight: 500,
    },
  }
}
