/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { isColorLike } from '@o/css'
import React, { PureComponent } from 'react'
import {
  DataInspectorControlled,
  DataInspectorExpanded,
  DataValueExtractor,
} from './DataInspectorControlled'

type DataInspectorProps = {
  /**
   * Object to inspect.
   */
  data: any
  /**
   * Object to compare with the provided `data` property.
   * Differences will be styled accordingly in the UI.
   */
  diff?: any
  /**
   * Whether to expand the root by default.
   */
  expandRoot?: boolean
  /**
   * An optional callback that will explode a value into its type and value.
   * Useful for inspecting serialised data.
   */
  extractValue?: DataValueExtractor
  /**
   * Callback when a value is edited.
   */
  setValue?: (path: Array<string>, val: any) => void
  /**
   * Whether all objects and arrays should be collapsed by default.
   */
  collapsed?: boolean
  /**
   * Object of all properties that will have tooltips
   */
  tooltips?: Object
}

type DataInspectorState = {
  expanded: DataInspectorExpanded
}

/**
 * Wrapper around `DataInspector` that handles expanded state.
 *
 * If you require lower level access to the state then use `DataInspector`
 * directly.
 */
export class DataInspector extends PureComponent<DataInspectorProps, DataInspectorState> {
  constructor(props: DataInspectorProps, context: Object) {
    super(props, context)
    this.state = {
      expanded: {},
    }
  }

  onExpanded = (expanded: DataInspectorExpanded) => {
    this.setState({ expanded })
  }

  extractValue = value => {
    if (typeof value === 'string' && isColorLike(value)) {
      return {
        type: 'color',
        value,
      }
    }
  }

  render() {
    return (
      <DataInspectorControlled
        data={this.props.data}
        diff={this.props.diff}
        extractValue={this.props.extractValue || this.extractValue}
        setValue={this.props.setValue}
        expanded={this.state.expanded}
        onExpanded={this.onExpanded}
        expandRoot={this.props.expandRoot}
        collapsed={this.props.collapsed}
        tooltips={this.props.tooltips}
      />
    )
  }
}
