import * as React from 'react'
import { view } from '@mcro/black'
import { ConfluenceSetupPane } from './settingSetupPanes/ConfluenceSetupPane'
import { JiraSetupPane } from './settingSetupPanes/JiraSetupPane'

const views = {
  confluence: ConfluenceSetupPane,
  jira: JiraSetupPane,
}

@view
export class View extends React.Component {
  render({ bit, children }) {
    if (!bit || !views[bit.id]) {
      console.error('no view or bit', bit.toJS(), views)
      return children({})
    }
    const View = views[bit.id]
    return children({
      title: bit.title,
      content: <View bit={bit} />,
    })
  }
}
