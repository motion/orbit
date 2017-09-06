import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { includes, isFunction } from 'lodash'
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

  render({ paneStore, render, options, style }) {
    const { actions, index, id } = options
    const { selectedIds } = paneStore
    const isActive = paneStore.getActiveIndex() === index
    const isSelected = includes(selectedIds, id)
    const showActions = isActive && selectedIds.length === 0

    const actionsEl = <Actions id={id} actions={actions} />
    // const actionsEl = <h4>im the actions</h4>

    return (
      <card
        style={style}
        onClick={() => {
          paneStore.setIndex(index)
        }}
      >
        {isFunction(render) &&
          render(isActive || isSelected, showActions && actionsEl)}
        {!isFunction(render) && <h3>needs a fn</h3>}
      </card>
    )
  }

  static style = {}
}
