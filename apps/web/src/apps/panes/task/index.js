// @flow
import { view } from '@mcro/black'
import * as Pane from '~/apps/pane'
import * as React from 'react'
import * as UI from '@mcro/ui'
import Comment from './comment'
import TaskStore from './taskStore'
import { LabelAction, AssignAction } from './actions'
import TaskResponse from './response'
import TaskHeader from './header'

declare class PaneStorish {
  activeIndex: number,
}

const typeToElement = type =>
  ({
    comment: Comment,
  }[type] || <h3>{type} not found</h3>)

@view({
  store: TaskStore,
})
export default class TaskPane extends React.Component<{
  paneStore: PaneStorish,
}> {
  render({ store, paneStore }) {
    if (!store.results.length) {
      return null
    }
    return (
      <card>
        <UI.Theme name="light">
          <TaskHeader paneStore={paneStore} store={store} />
          <Pane.Card
            items={store.results}
            getItem={({ elName, data }, index) => {
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
          <TaskResponse paneStore={paneStore} store={store} />
        </UI.Theme>
      </card>
    )
  }

  static style = {
    card: {
      padding: 15,
      flex: 1,
      width: '100%',
      background: '#fff',
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.1]]],
      borderRadius: 3,
    },
  }
}
