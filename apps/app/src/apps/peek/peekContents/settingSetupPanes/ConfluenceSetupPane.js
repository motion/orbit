import * as React from 'react'
import { view } from '@mcro/black'
import { ConfluenceSettingLogin } from '../settingPanes/ConfluenceSettingLogin'

@view
export class ConfluenceSetupPane extends React.Component {
  render() {
    return <ConfluenceSettingLogin />
  }
}
