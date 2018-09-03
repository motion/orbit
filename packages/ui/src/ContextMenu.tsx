/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import { Col } from './blocks/Col'

type MenuTemplate = Array<any>

type Props = {
  items?: MenuTemplate
  buildItems?: () => MenuTemplate
  children: React.ReactNode
  component?: React.ComponentType<any> | string
}

export default class ContextMenu extends React.Component<Props> {
  static defaultProps = {
    component: Col,
  }

  static contextTypes = {
    appendToContextMenu: PropTypes.func,
  }

  onContextMenu = (_: React.MouseEvent) => {
    if (typeof this.context.appendToContextMenu === 'function') {
      if (this.props.items != null) {
        this.context.appendToContextMenu(this.props.items)
      } else if (this.props.buildItems != null) {
        this.context.appendToContextMenu(this.props.buildItems())
      }
    }
  }

  render() {
    const {
      items: _ignoreItems,
      buildItems: _buildItems,
      component,
      ...props
    } = this.props
    return React.createElement(
      component,
      {
        onContextMenu: this.onContextMenu,
        ...props,
      },
      this.props.children,
    )
  }
}
