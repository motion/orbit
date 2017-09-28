// @flow
import { view } from '@mcro/black'
import * as Pane from '~/apps/pane'
import * as React from 'react'
import Comment from './comment'
import TaskStore from './store'
import { LabelAction, AssignAction } from './actions'
import TaskResponse from './response'
import Similar from './similar'
import TaskHeader from './header'

declare class PaneStorish {
  activeIndex: number,
}

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
export default class TaskPane extends React.Component<{
  paneStore: PaneStorish,
}> {
  render({ store }) {
    if (!store.results.length) {
      return null
    }
    return (
      <Pane.Card
        items={store.results}
        getItem={({ elName, data }, index) => {
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
        }}
        actions={[
          {
            name: 'labels',
            popover: props => <LabelAction store={store} {...props} />,
          },
          {
            name: 'assign',
            popover: props => <AssignAction store={store} {...props} />,
          },
        ]}
      />
    )
  }
}
