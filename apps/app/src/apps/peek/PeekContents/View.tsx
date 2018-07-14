import * as React from 'react'
import { view } from '@mcro/black'
import { ConfluenceSetupPane } from './settingSetupPanes/ConfluenceSetupPane'
import { JiraSetupPane } from './settingSetupPanes/JiraSetupPane'
import { PeekContentProps } from './PeekContentProps'

const views = {
  confluence: ConfluenceSetupPane,
  jira: JiraSetupPane,
}

@view
export class View extends React.Component<PeekContentProps> {
  render() {
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
}
