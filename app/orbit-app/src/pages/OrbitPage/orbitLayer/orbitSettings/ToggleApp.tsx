import * as React from 'react'
import { AppActions } from '../../../../actions/AppActions'
import { AppConfig } from '@mcro/stores'
import { getTargetPosition } from '../../../../helpers/getTargetPosition'
import { findDOMNode } from 'react-dom'

export class ToggleApp extends React.Component<{
  appConfig: AppConfig
  children: React.ReactElement<any>
}> {
  handleClick = () => {
    AppActions.togglePeekApp({
      appConfig: this.props.appConfig,
      target: findDOMNode(this) as HTMLDivElement,
    })
  }
  render() {
    return React.cloneElement(this.props.children, {
      onClick: this.handleClick,
    })
  }
}
