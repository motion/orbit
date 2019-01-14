import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { findDOMNode } from 'react-dom'
import { AppConfig } from '@mcro/models'

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
