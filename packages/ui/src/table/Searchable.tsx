/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { view, on } from '@mcro/black'
import { Filter } from './types'
import * as React from 'react'
import { Toolbar } from '../Toolbar'
import { Row } from '../blocks/Row'
import { TableInput } from './TableInput'
import { colors } from '../helpers/colors'
import { Text } from '../Text'
import { View } from '../blocks/View'
import { Icon } from '../Icon'
import { FilterToken } from './FilterToken'
import PropTypes from 'prop-types'
import { Theme } from '@mcro/gloss'
import { findDOMNode } from 'react-dom'

type Props = {
  defaultValue?: string
  placeholder?: string
  actions: React.ReactNode
  tableKey: string
  onFilterChange: (filters: Array<Filter>) => void
  defaultFilters: Array<Filter>
  searchBarTheme?: Object
  searchBarProps?: Object
  searchInputProps?: Object
  children?: React.ReactNode | Function
  focusOnMount?: boolean
}

const SEARCHABLE_STORAGE_KEY = (key: string) => `SEARCHABLE_STORAGE_KEY_${key}`

const SearchBar = view(Toolbar, {
  height: 42,
  padding: 6,
})

export const SearchBox = view(View, {
  position: 'relative',
  flexFlow: 'row',
  borderRadius: '999em',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  paddingLeft: 4,
  background: colors.white,
  border: [1, colors.light15],
})

SearchBox.theme = ({ theme }) => ({
  border: [1, theme.base.borderColor.darken(0.2).desaturate(0.2)],
})

export const SearchInput = view(TableInput, {
  padding: 0,
  fontSize: '1em',
  flexGrow: 1,
  background: 'transparent',
  height: '100%',
  flex: 1,
  lineHeight: '100%',
  marginLeft: 2,
  '&::-webkit-input-placeholder': {
    color: colors.placeholder,
    fontWeight: 300,
  },
})

SearchInput.theme = ({ focus }) => ({
  border: focus ? '1px solid black' : 0,
})

const Clear = view(Text, {
  position: 'absolute',
  right: 6,
  top: '50%',
  marginTop: -9,
  fontSize: 16,
  width: 17,
  height: 17,
  borderRadius: 999,
  lineHeight: '15.5px',
  textAlign: 'center',
  backgroundColor: 'rgba(0,0,0,0.1)',
  color: colors.white,
  display: 'block',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
})

export const SearchIcon = view(Icon, {
  marginRight: 4,
  marginLeft: 3,
  marginTop: -1,
  minWidth: 16,
})

const Actions = view(Row, {
  marginLeft: 8,
  flexShrink: 0,
})

export type SearchableProps = {
  addFilter: (filter: Filter) => void
  searchTerm: string
  filters: Array<Filter>
}

type State = {
  filters: Array<Filter>
  focusedToken: number
  searchTerm: string
  hasFocus: boolean
}

export const Searchable = (Component: any) =>
  class extends React.PureComponent<Props, State> {
    static defaultProps = {
      placeholder: 'Search...',
      defaultValue: '',
    }

    static contextTypes = {
      plugin: PropTypes.string,
    }

    constructor(a, b) {
      super(a, b)
      this.state = {
        filters: [],
        focusedToken: -1,
        searchTerm: this.props.defaultValue,
        hasFocus: false,
      }
    }

    inputRef = React.createRef<HTMLTextAreaElement>()

    get _inputRef() {
      return this.inputRef.current
    }

    componentDidMount() {
      if (this.props.focusOnMount) {
        if (this._inputRef) {
          this._inputRef.focus()
        }
      }
      on(this, findDOMNode(this), 'keydown', this.onKeyDown)
      const { defaultFilters } = this.props
      let savedState
      let key = this.context.plugin + this.props.tableKey
      try {
        savedState = JSON.parse(
          window.localStorage.getItem(SEARCHABLE_STORAGE_KEY(key)) || 'null',
        )
      } catch (e) {
        window.localStorage.removeItem(SEARCHABLE_STORAGE_KEY(key))
      }
      if (savedState) {
        if (this.props.onFilterChange != null) {
          this.props.onFilterChange(savedState.filters)
        }
        if (defaultFilters != null) {
          const savedStateFilters = savedState.filters
          defaultFilters.forEach(defaultFilter => {
            const filterIndex = savedStateFilters.findIndex(
              f => f.key === defaultFilter.key,
            )
            if (filterIndex > -1) {
              const defaultFilter: Filter = defaultFilters[filterIndex]
              if (defaultFilter.type === 'enum') {
                savedStateFilters[filterIndex].enum = defaultFilter.enum
              }
              const filters = new Set(
                savedStateFilters[filterIndex].enum.map(filter => filter.value),
              )
              savedStateFilters[filterIndex].value = savedStateFilters[
                filterIndex
              ].value.filter(value => filters.has(value))
            }
          })
        }
        this.setState({
          searchTerm: savedState.searchTerm || '',
          filters: savedState.filters || [],
        })
      }
    }

    componentDidUpdate(_: Props, prevState: State) {
      if (
        this.context.plugin &&
        (prevState.searchTerm !== this.state.searchTerm ||
          prevState.filters !== this.state.filters)
      ) {
        let key = this.context.plugin + this.props.tableKey
        window.localStorage.setItem(
          SEARCHABLE_STORAGE_KEY(key),
          JSON.stringify({
            searchTerm: this.state.searchTerm,
            filters: this.state.filters,
          }),
        )
        if (this.props.onFilterChange != null) {
          this.props.onFilterChange(this.state.filters)
        }
      }
    }

    componentWillUnmount() {
      window.document.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (e: React.KeyboardEvent<any>) => {
      const ctrlOrCmd = e =>
        (e.metaKey && process.platform === 'darwin') ||
        (e.ctrlKey && process.platform !== 'darwin')

      if (e.key === 'f' && ctrlOrCmd(e) && this._inputRef) {
        e.preventDefault()
        if (this._inputRef) {
          this._inputRef.focus()
        }
      } else if (e.key === 'Escape' && this._inputRef) {
        this._inputRef.blur()
        this.setState({ searchTerm: '' })
      } else if (e.key === 'Backspace' && this.hasFocus()) {
        if (
          this.state.focusedToken === -1 &&
          this.state.searchTerm === '' &&
          this._inputRef &&
          !this.state.filters[this.state.filters.length - 1].persistent
        ) {
          this._inputRef.blur()
          this.setState({ focusedToken: this.state.filters.length - 1 })
        } else {
          this.removeFilter(this.state.focusedToken)
        }
      } else if (
        e.key === 'Delete' &&
        this.hasFocus() &&
        this.state.focusedToken > -1
      ) {
        this.removeFilter(this.state.focusedToken)
      } else if (e.key === 'Enter' && this.hasFocus() && this._inputRef) {
        this.matchTags(this._inputRef.value, true)
      }
    }

    onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.matchTags(e.target.value, false)

    matchTags = (searchTerm: string, matchEnd: boolean) => {
      const filterPattern = matchEnd
        ? /([a-z][a-z0-9]*[!]?[:=][^\s]+)($|\s)/gi
        : /([a-z][a-z0-9]*[!]?[:=][^\s]+)\s/gi
      const match = searchTerm.match(filterPattern)
      if (match && match.length > 0) {
        match.forEach((filter: string) => {
          const separator =
            filter.indexOf(':') > filter.indexOf('=') ? ':' : '='
          let [key, ...values] = filter.split(separator)
          let value = values.join(separator).trim()
          let type = 'include'
          // if value starts with !, it's an exclude filter
          if (value.indexOf('!') === 0) {
            type = 'exclude'
            value = value.substring(1)
          }
          // if key ends with !, it's an exclude filter
          if (key.indexOf('!') === key.length - 1) {
            type = 'exclude'
            key = key.slice(0, -1)
          }
          this.addFilter({
            type,
            key,
            value,
          })
        })

        searchTerm = searchTerm.replace(filterPattern, '')
      }
      this.setState({ searchTerm })
    }

    addFilter = (filter: Filter) => {
      const filterIndex = this.state.filters.findIndex(
        f => f.key === filter.key,
      )
      if (filterIndex > -1) {
        const filters = [...this.state.filters]
        const defaultFilter: Filter = this.props.defaultFilters[filterIndex]
        if (
          defaultFilter != null &&
          defaultFilter.type === 'enum' &&
          filters[filterIndex].type === 'enum'
        ) {
          filters[filterIndex].enum = defaultFilter.enum
        }
        this.setState({ filters })
        // filter for this key already exists
        return
      }
      // persistent filters are always at the front
      const filters =
        filter.persistent === true
          ? [filter, ...this.state.filters]
          : this.state.filters.concat(filter)
      this.setState({
        filters,
        focusedToken: -1,
      })
    }

    removeFilter = (index: number) => {
      const filters = this.state.filters.filter((_, i) => i !== index)
      const focusedToken = -1
      this.setState({ filters, focusedToken }, () => {
        if (this._inputRef) {
          this._inputRef.focus()
        }
      })
    }

    replaceFilter = (index: number, filter: Filter) => {
      const filters = [...this.state.filters]
      filters.splice(index, 1, filter)
      this.setState({ filters })
    }

    onInputFocus = () =>
      this.setState({
        focusedToken: -1,
        hasFocus: true,
      })

    onInputBlur = () =>
      setTimeout(
        () =>
          this.setState({
            hasFocus: false,
          }),
        100,
      )

    onTokenFocus = (focusedToken: number) => this.setState({ focusedToken })

    onTokenBlur = () => this.setState({ focusedToken: -1 })

    hasFocus = (): boolean => {
      return this.state.focusedToken !== -1 || this.state.hasFocus
    }

    clear = () =>
      this.setState({
        filters: this.state.filters.filter(
          f => f.persistent != null && f.persistent === true,
        ),
        searchTerm: '',
      })

    render() {
      const {
        placeholder,
        actions,
        searchBarProps,
        searchInputProps,
        focusOnMount,
        searchBarTheme,
        ...props
      } = this.props

      console.log('RENDER SEARCHABLE')

      const searchBar = (
        <Theme theme={searchBarTheme}>
          <SearchBar position="top" key="searchbar" {...searchBarProps}>
            <SearchBox tabIndex={-1}>
              <SearchIcon
                name="ui-1_zoom"
                color={colors.macOSTitleBarIcon}
                size={16}
              />
              {this.state.filters.map((filter, i) => (
                <FilterToken
                  key={`${filter.key}:${filter.type}`}
                  index={i}
                  filter={filter}
                  focused={i === this.state.focusedToken}
                  onFocus={this.onTokenFocus}
                  onDelete={this.removeFilter}
                  onReplace={this.replaceFilter}
                  onBlur={this.onTokenBlur}
                />
              ))}
              <SearchInput
                placeholder={placeholder}
                onChange={this.onChangeSearchTerm}
                value={this.state.searchTerm}
                forwardRef={this.inputRef}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                {...searchInputProps}
              />
              {this.state.searchTerm || this.state.filters.length > 0 ? (
                <Clear onClick={this.clear}>&times;</Clear>
              ) : null}
            </SearchBox>
            {actions != null ? <Actions>{actions}</Actions> : null}
          </SearchBar>
        </Theme>
      )

      const body = (
        <Component
          {...props}
          key="table"
          addFilter={this.addFilter}
          searchTerm={this.state.searchTerm}
          searchBar={searchBar}
          filters={this.state.filters}
        />
      )

      if (typeof props.children === 'function') {
        return body
      }

      return (
        <>
          {searchBar}
          {body}
        </>
      )
    }
  }
