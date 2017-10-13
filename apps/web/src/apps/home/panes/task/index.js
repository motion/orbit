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

const typeToElement = {
  comment: Comment,
}

@view({
  taskStore: TaskStore,
})
class TaskMain {
  render({ taskStore, paneStore, paneProps, result, setMainStore }) {
    // TODO automate this probably
    setMainStore(taskStore)

    const getElement = ({ elName, data }, index) => {
      const Element = typeToElement[elName]
      return {
        children: () => (
          <Element
            data={data}
            taskStore={taskStore}
            paneStore={paneStore}
            key={index}
          />
        ),
      }
    }

    return (
      <Pane
        {...paneProps}
        items={taskStore.results}
        getItem={(item, index) => {
          return item.elName
            ? getElement(item, index)
            : item || (() => <null>not found</null>)
        }}
      >
        {list => (
          <content $$flex={1}>
            <TaskHeader taskStore={taskStore} result={result} />
            {list}
            <TaskResponse taskStore={taskStore} />
          </content>
        )}
      </Pane>
    )
  }
}

export default {
  Sidebar: TaskSidebar,
  Main: TaskMain,
}
