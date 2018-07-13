/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import * as React from 'react'
import FlexColumn from './FlexColumn'
import styled from '../styled/index'
import PropTypes from 'prop-types'

type MenuTemplate = Array<any>

type Props = {
  items?: MenuTemplate
  buildItems?: () => MenuTemplate
  children: any
  component: React.ComponentType<any> | string
}

export class ContextMenu extends styled.StylablePureComponent<Props> {
  static defaultProps = {
    component: FlexColumn,
  }

  static contextTypes = {
    appendToContextMenu: PropTypes.func,
  }

  onContextMenu = (e: MouseEvent) => {
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
      items: _itesm,
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
