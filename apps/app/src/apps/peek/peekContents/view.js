import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader, PeekContent } from '../index'
import { ConfluenceSetupPane } from './settingSetupPanes/ConfluenceSetupPane'
import { JiraSetupPane } from './settingSetupPanes/JiraSetupPane'

const views = {
  confluence: ConfluenceSetupPane,
  jira: JiraSetupPane,
}

@view
export class View extends React.Component {
  render({ bit }) {
    const View = views[bit.id]
    if (!View) {
      console.error('no view', bit.toJS())
      return null
    }
    return (
      <>
        <PeekHeader title={bit.title} />
        <PeekContent>
          <View bit={bit} />
        </PeekContent>
      </>
    )
  }
}
