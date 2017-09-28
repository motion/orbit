import { view } from '@mcro/black'
import * as Pane from '~/apps/panes/pane'
import * as React from 'react'
import Comment from './comment'
import TaskStore from './store'
import { LabelAction, AssignAction } from './actions'
import TaskResponse from './response'
import Similar from './similar'
import TaskHeader from './header'

const typeToElement = type =>
  ({
    comment: Comment,
    header: TaskHeader,
    response: TaskResponse,
    similar: Similar,
  }[type] || <h3>{type} not found</h3>)

@view({
  store: TaskStore,
})
export default class TaskPane {
  getItem = ({ elName, data }, index) => {
    const { store, paneStore } = this.props
    const El = typeToElement(elName)

    return {
      highlight: () => index === paneStore.activeIndex,
      children: () => (
        <El
          data={data}
          store={store}
          paneStore={paneStore}
          key={index}
          isActive={index === paneStore.activeIndex}
        />
      ),
    }
  }

  render({ store }) {
    if (!store.results.length) {
      return null
    }

    const actions = [
      {
        name: 'labels',
        popover: props => <LabelAction store={store} {...props} />,
      },
      {
        name: 'assign',
        popover: props => <AssignAction store={store} {...props} />,
      },
    ]

    return (
      <Pane.Card
        items={store.results}
        getItem={this.getItem}
        actions={actions}
      />
    )
  }
}
