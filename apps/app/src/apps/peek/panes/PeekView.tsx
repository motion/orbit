import * as React from 'react'
import { ConfluenceSetupPane } from './viewPanes/ConfluenceSetupPane'
import { JiraSetupPane } from './viewPanes/JiraSetupPane'
import { PeekPaneProps } from '../PeekPaneProps'

const views = {
  confluence: ConfluenceSetupPane,
  jira: JiraSetupPane,
}

export const PeekView = (_: PeekPaneProps) => {
  const { bit, children } = this.props
  if (!bit || !views[bit.id]) {
    console.log('no view or bit', bit, views)
    return children({})
  }
  const View = views[bit.id]
  return children({
    title: bit.title,
    content: <View bit={bit} />,
  })
}
