// @flow
import { view } from '@mcro/black'
import Pane from '../pane'
import * as React from 'react'
import * as UI from '@mcro/ui'
import Comment from './taskComment'
import TaskStore from './taskStore'
import { LabelAction, AssignAction } from './taskActions'
import TaskResponse from './taskResponse'
import TaskHeader from './taskHeader'
import TaskSidebar from './taskSidebar'

declare class PaneStorish {
  activeIndex: number,
}

const typeToElement = {
  comment: Comment,
}

@view({
  taskStore: TaskStore,
})
class TaskMain extends React.Component<{
  paneStore: PaneStorish,
}> {
  render({ taskStore, paneStore, paneProps }) {
    if (!taskStore.results.length) {
      return null
    }
    return (
      <card>
        <UI.Theme name="light">
          <TaskHeader taskStore={taskStore} />
          <Pane
            {...paneProps}
            items={taskStore.results}
            getItem={({ elName, data }, index) => {
              console.log('datais', data)
              const El = typeToElement[elName] || (() => <null>not found</null>)
              return {
                children: () => (
                  <El
                    data={data}
                    store={taskStore}
                    paneStore={paneStore}
                    key={index}
                  />
                ),
              }
            }}
            actions={[
              {
                name: 'labels',
                popover: props => <LabelAction store={taskStore} {...props} />,
              },
              {
                name: 'assign',
                popover: props => <AssignAction store={taskStore} {...props} />,
              },
            ]}
          />
          <TaskResponse taskStore={taskStore} />
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

export default {
  Sidebar: TaskSidebar,
  Main: TaskMain,
}
