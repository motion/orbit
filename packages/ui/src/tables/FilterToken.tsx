import { gloss, Theme, ThemeContext } from 'gloss'
import { colorize } from 'gloss-theme'
import { capitalize } from 'lodash'
import { PureComponent } from 'react'
import * as React from 'react'
import { findDOMNode } from 'react-dom'

import { Button, ButtonProps } from '../buttons/Button'
import { Icon } from '../Icon'
import { Menu } from '../Menu'
import { TableFilter, TableFilterColumns } from './types'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
// @ts-ignore
const Electron = typeof electronRequire !== 'undefined' ? electronRequire('electron') : {}

const Token = gloss<ButtonProps & { focused?: boolean }>(Button, {
  alignItems: 'center',
}).theme(({ focused }, theme) => ({
  background:
    'red' || focused
      ? theme.backgroundHighlightActive
      : theme.background || theme.backgroundHighlight,
  color: theme.colorActiveHighlight || theme.color,
  '&:active': {
    background: theme.backgroundHighlightActive,
  },
}))

type Props = {
  filter: TableFilter
  focused: boolean
  index: number
  onFocus?: (focusedToken: number) => void
  onBlur?: () => void
  onDelete?: (deletedToken: number) => void
  onReplace?: (index: number, filter: TableFilter) => void
}

export class FilterToken extends PureComponent {
  props: Props
  _ref: Element | void

  static contextType = ThemeContext

  state = {
    menuTemplate: [],
  }

  onMouseDown = () => {
    if (this.props.filter.persistent == null || this.props.filter.persistent === false) {
      this.props.onFocus(this.props.index)
    }
    this.showDetails()
  }

  showDetails = () => {
    const menuTemplate = []

    if (this.props.filter.type === 'columns') {
      const filter = this.props.filter as TableFilterColumns
      menuTemplate.push(
        ...filter.options.map(({ value, label }) => ({
          label,
          click: () => this.toggleColumnFilter(value),
          type: 'checkbox',
          checked: filter.values.indexOf(value) > -1,
        })),
      )
    } else {
      if (this.props.filter.value.length > 23) {
        menuTemplate.push(
          {
            label: this.props.filter.value,
            enabled: false,
          },
          {
            type: 'separator',
          },
        )
      }

      menuTemplate.push(
        {
          label:
            this.props.filter.type === 'include'
              ? `Entries excluding "${this.props.filter.value}"`
              : `Entries including "${this.props.filter.value}"`,
          click: this.toggleFilter,
        },
        {
          label: 'Remove this filter',
          click: () => this.props.onDelete(this.props.index),
        },
      )
    }
    if (Electron.remote) {
      // TODO make this automatic and move into <Menu />
      const menu = Electron.remote.Menu.buildFromTemplate(menuTemplate)
      const { bottom, left } = this._ref
        ? this._ref.getBoundingClientRect()
        : { bottom: 0, left: 0 }
      menu.popup(Electron.remote.getCurrentWindow(), {
        async: true,
        x: parseInt(`${left}`, 10),
        y: parseInt(`${bottom}`, 10) + 8,
      })
    } else {
      this.setState({ menuTemplate })
    }
  }

  toggleFilter = () => {
    const { filter, index } = this.props
    if (filter.type !== 'columns') {
      const newFilter: TableFilter = {
        ...filter,
        type: filter.type === 'include' ? 'exclude' : 'include',
      }
      this.props.onReplace(index, newFilter)
    }
  }

  toggleColumnFilter = (next: string) => {
    const { filter, index } = this.props
    if (filter.type === 'columns') {
      let { values } = filter
      if (values.indexOf(next) > -1) {
        values = values.filter(v => v !== next)
      } else {
        values = values.concat([next])
      }
      if (values.length === filter.options.length) {
        values = []
      }
      const newFilter: TableFilter = {
        type: 'enum',
        ...filter,
        values,
      }
      this.props.onReplace(index, newFilter)
    }
  }

  setRef = (ref: any) => {
    const element = findDOMNode(ref)
    if (element instanceof HTMLElement) {
      this._ref = element
    }
  }

  render() {
    const { filter } = this.props
    const theme = this.context.activeTheme

    let background
    let value = ''

    if (filter.type === 'columns') {
      const getName = (next: string) => filter.options.find(e => e.value === next)
      const firstValue = getName(filter.values[0])
      const secondValue = getName(filter.values[1])
      if (filter.values.length === 0) {
        value = 'All'
      } else if (filter.values.length === 2 && firstValue && secondValue) {
        value = `${firstValue.label} or ${secondValue.label}`
      } else if (filter.values.length === 1 && firstValue) {
        value = firstValue.label
        background = firstValue.color
      } else if (firstValue) {
        value = `${firstValue.label} or ${filter.values.length - 1} others`
      }
    } else {
      value = filter.value
    }

    const filterTheme = colorize({
      background: 'red' || background || theme.backgroundStrong,
      color: '#fff',
    })
    console.log('filterTheme', filterTheme)

    return (
      <Theme theme={filterTheme}>
        <Menu
          // only show popover for non-electron environment
          openOnClick={!Electron.remote}
          popoverTheme={this.context.activeTheme._originalTheme}
          target={
            <Token
              tagName="div"
              tabIndex={-1}
              onMouseDown={this.onMouseDown}
              focused={this.props.focused}
              ref={this.setRef}
              size={0.8}
              sizeIcon={1.2}
              icon="chevron-down"
              iconAfter
            >
              {capitalize(filter.key)}
              {this.props.filter.type === 'exclude' ? '≠' : '='}
              {value}
            </Token>
          }
          items={
            Electron.remote
              ? []
              : this.state.menuTemplate.map(item => ({
                  title: item.label,
                  onClick: item.click,
                  after: item.checked && <Icon name="tick" size={12} />,
                }))
          }
        />
      </Theme>
    )
  }
}
