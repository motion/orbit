import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { AppActions } from '../../actions/AppActions';
import { AppConfig } from '../../apps/AppTypes';

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
