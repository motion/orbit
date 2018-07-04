import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader, PeekContent } from '../index'
import { ConfluenceSetupPane } from './settingSetupPanes/ConfluenceSetupPane'

const views = {
  confluence: ConfluenceSetupPane,
}

@view
export class View extends React.Component {
  render({ bit }) {
    const View = views[bit.id]
    if (!View) {
      console.error('no view')
      return
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
