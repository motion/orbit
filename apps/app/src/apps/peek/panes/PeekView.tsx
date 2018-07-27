import * as React from 'react'
import { ConfluenceSetupPane } from './viewPanes/ConfluenceSetupPane'
import { JiraSetupPane } from './viewPanes/JiraSetupPane'
import { PeekPaneProps } from '../PeekPaneProps'

const views = {
  confluence: ConfluenceSetupPane,
  jira: JiraSetupPane,
}

export const PeekView = ({ item, children }: PeekPaneProps) => {
  if (!item || !views[item.id]) {
    console.log('no view or item', item, views)
    return children({})
  }
  const View = views[item.id]
  return children({
    title: item.title,
    content: <View item={item} />,
  })
}
