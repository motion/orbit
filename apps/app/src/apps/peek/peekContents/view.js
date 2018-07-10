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
    if (!View) {
      console.error('no view', bit.toJS())
      return children({})
    }
    return children({
      title: bit.title,
      content: <View bit={bit} />,
    })
  }
}
