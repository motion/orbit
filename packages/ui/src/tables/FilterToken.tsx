/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { gloss, Theme } from 'gloss'
import * as React from 'react'
import { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'

import { Button, ButtonProps } from '../buttons/Button'
import { Icon } from '../Icon'
import { PopoverMenu } from '../PopoverMenu'
import { Text } from '../text/Text'
import { TableFilter } from './types'

// @ts-ignore
const Electron = typeof electronRequire !== 'undefined' ? electronRequire('electron') : {}

const Token = gloss<ButtonProps & { focused?: boolean }>(Button, {
  alignItems: 'center',
}).theme(({ focused, background }, theme) => ({
  background: focused ? theme.backgroundHighlightActive : background || theme.backgroundHighlight,
  color: theme.colorActiveHighlight || 'white',
  '&:active': {
    background: theme.backgroundHighlightActive,
  },
}))

const Key = gloss(Text, {
  position: 'relative',
  fontWeight: 400,
  paddingRight: 12,
  textTransform: 'capitalize',
  lineHeight: '21px',
  '&:after': {
    paddingLeft: 5,
    position: 'absolute',
    top: -1,
    right: 0,
    fontSize: 14,
  },
}).theme(({ type }, theme) => ({
  color: theme.colorActiveHighlight || 'white',
  '&:active:after': {
    background: theme.backgroundHighlightActive,
  },
  '&:after': {
    content: type === 'exclude' ? '"≠"' : '"="',
  },
}))

Key.defaultProps = {
  size: 0.95,
}

const Value = gloss(Text, {
  whiteSpace: 'nowrap',
  maxWidth: 160,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '21px',
  paddingLeft: 3,
}).theme((_, theme) => ({
  color: theme.colorActiveHighlight || 'white',
}))

Value.defaultProps = {
  size: 0.95,
}

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

  state = {
    menuTemplate: null,
  }

  onMouseDown = () => {
    if (this.props.filter.persistent == null || this.props.filter.persistent === false) {
      this.props.onFocus(this.props.index)
    }
    this.showDetails()
  }

  showDetails = () => {
    const menuTemplate = []

    if (this.props.filter.type === 'enum') {
      menuTemplate.push(
        ...this.props.filter.enum.map(({ value, label }) => ({
          label,
          click: () => this.changeEnum(value),
          type: 'checkbox',
          checked: this.props.filter.value.indexOf(value) > -1,
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
    if (filter.type !== 'enum') {
      const newFilter: TableFilter = {
        ...filter,
        type: filter.type === 'include' ? 'exclude' : 'include',
      }
      this.props.onReplace(index, newFilter)
    }
  }

  changeEnum = (newValue: string) => {
    const { filter, index } = this.props
    if (filter.type === 'enum') {
      let { value } = filter
      if (value.indexOf(newValue) > -1) {
        value = value.filter(v => v !== newValue)
      } else {
        value = value.concat([newValue])
      }
      if (value.length === filter.enum.length) {
        value = []
      }
      const newFilter: TableFilter = {
        type: 'enum',
        ...filter,
        value,
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
    let background
    let value = ''

    if (filter.type === 'enum') {
      const getEnum = next => filter.enum.find(e => e.value === next)
      const firstValue = getEnum(filter.value[0])
      const secondValue = getEnum(filter.value[1])
      if (filter.value.length === 0) {
        value = 'All'
      } else if (filter.value.length === 2 && firstValue && secondValue) {
        value = `${firstValue.label} or ${secondValue.label}`
      } else if (filter.value.length === 1 && firstValue) {
        console.log('firstValue.color', firstValue.color)
        value = firstValue.label
        background = firstValue.color
      } else if (firstValue) {
        value = `${firstValue.label} or ${filter.value.length - 1} others`
      }
    } else {
      value = filter.value
    }

    return (
      <Theme theme={{ background, color: '#fff' }}>
        <PopoverMenu
          // only show popover for non-electron environment
          openOnClick={!Electron.remote}
          target={
            <Token
              tabIndex={-1}
              onMouseDown={this.onMouseDown}
              focused={this.props.focused}
              ref={this.setRef}
              size={0.8}
              sizeIcon={1.2}
              icon="chevron-down"
              iconAfter
            >
              <Key type={this.props.filter.type} focused={this.props.focused}>
                {filter.key}
              </Key>
              <Value>{value}</Value>
            </Token>
          }
          items={
            Electron.remote
              ? []
              : this.state.menuTemplate.map(item => ({
                  title: item.label,
                  onClick: item.click,
                  after: item.checked && <Icon name="check" />,
                }))
          }
        />
      </Theme>
    )
  }
}
