/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import ErrorBlock from './ErrorBlock'
import {Component} from 'react';
import Heading from './Heading'
import Button from './Button'
import View from './View'
import LogManager from '../../fb-stubs/Logger'

const ErrorBoundaryContainer = View.extends({
  overflow: 'auto',
  padding: 10,
});

const ErrorBoundaryStack = ErrorBlock.extends({
  marginBottom: 10,
});

type ErrorBoundaryProps = {
  buildHeading?: (err: Error) => string,
  heading?: string,
  logger?: LogManager,
  showStack?: boolean,
  children?: React$Node,
};

type ErrorBoundaryState = {|
  error: Error | void,
|};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState,
> {
  constructor(props: ErrorBoundaryProps, context: Object) {
    super(props, context);
    this.state = {error: null};
  }

  componentDidCatch(err: Error) {
    this.props.logger &&
      this.props.logger.error(err.toString(), 'ErrorBoundary');
    this.setState({error: err});
  }

  clearError = () => {
    this.setState({error: null});
  };

  render() {
    const {error} = this.state;
    if (error) {
      const {buildHeading} = this.props;
      let {heading} = this.props;
      if (buildHeading) {
        heading = buildHeading(error);
      }
      if (heading == null) {
        heading = 'An error has occured';
      }

      return (
        <ErrorBoundaryContainer fill={true}>
          <Heading>{heading}</Heading>
          {this.props.showStack !== false && (
            <ErrorBoundaryStack error={error} />
          )}
          <Button onClick={this.clearError}>Clear error and try again</Button>
        </ErrorBoundaryContainer>
      );
    } else {
      return this.props.children;
    }
  }
}
