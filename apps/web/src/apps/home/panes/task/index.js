import { view } from '@mcro/black'
import Pane from '../pane'
import * as React from 'react'
import Comment from './taskComment'
import TaskStore from './taskStore'
import TaskResponse from './taskResponse'
import TaskHeader from './taskHeader'

const typeToElement = {
  comment: Comment,
}

@view({
  taskStore: TaskStore,
})
export default class TaskMain {
  render({ taskStore, paneStore, paneProps, result, setMainStore }) {
    // TODO automate this probably
    if (setMainStore) {
      setMainStore(taskStore)
    }

    const getElement = ({ elName, data }, index) => {
      const Element = typeToElement[elName]
      return {
        children: () => (
          <Element
            data={data}
            taskStore={taskStore}
            paneStore={paneStore}
            index={index}
            key={index}
          />
        ),
      }
    }

    return (
      <Pane
        {...paneProps}
        actions={[{ title: 'Respond' }, { title: 'Close' }, { title: 'Label' }]}
        items={[
          () => <TaskHeader taskStore={taskStore} result={result} />,
          ...taskStore.results,
          () => <TaskResponse taskStore={taskStore} />,
        ]}
        getItem={(item, index) => {
          return item.elName
            ? getElement(item, index)
            : { children: item } || (() => <null>not found</null>)
        }}
      />
    )
  }
}
