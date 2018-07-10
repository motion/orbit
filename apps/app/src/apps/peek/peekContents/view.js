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
    const View = views[bit.id]
    if (!View || !bit) {
      console.error('no view or bit', bit.toJS(), View)
      return children({})
    }
    return children({
      title: bit.title,
      content: <View bit={bit} />,
    })
  }
}
