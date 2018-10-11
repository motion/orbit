import * as React from 'react'
import { Actions } from '../../../../actions/Actions'
import { AppConfig } from '@mcro/stores'
import { getTargetPosition } from '../../../../helpers/getTargetPosition'
import { findDOMNode } from 'react-dom'

export class ToggleApp extends React.Component<{
  appConfig: AppConfig
  children: React.ReactElement<any>
}> {
  handleClick = () => {
    Actions.togglePeekApp(
      this.props.appConfig,
      getTargetPosition(findDOMNode(this) as HTMLDivElement),
    )
  }
  render() {
    return React.cloneElement(this.props.children, {
      onClick: this.handleClick,
    })
  }
}
