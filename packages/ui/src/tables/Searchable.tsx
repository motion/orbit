/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { on } from '@o/utils'
import * as React from 'react'
import { findDOMNode } from 'react-dom'

import { SearchInput, SearchInputProps } from '../forms/SearchInput'
import { FilterIncludeExclude, TableFilter } from './types'

type State = {
  filters: TableFilter[]
  focusedToken: number
  searchTerm: string
  hasFocus: boolean
}

type Props = {
  width?: number | string
  defaultValue?: string
  placeholder?: string
  actions?: React.ReactNode
  tableKey?: string
  onFilterChange?: (filters: TableFilter[]) => void
  defaultFilters?: TableFilter[]
  searchBarTheme?: Object
  searchInputProps?: Object
  children?: (props: SearchableChildProps) => React.ReactNode
  focusOnMount?: boolean
  // only called once it changes once at least
  onChangeSearch?: Function
  onEnter?: Function
  before?: React.ReactNode
  after?: React.ReactNode
}

export type SearchableProps = Props & {
  addFilter: (filter: TableFilter) => void
  searchTerm: string
  filters: TableFilter[]
}

export type SearchBarType = React.ReactElement<React.SFC<SearchInputProps>>

export type SearchableChildProps = {
  addFilter: (filter: TableFilter) => void
  searchTerm: string
  searchBar: SearchBarType
  filters: TableFilter[]
}

const SEARCHABLE_STORAGE_KEY = (key: string) => `SEARCHABLE_STORAGE_KEY_${key}`

// TODO
export const SearchableContext = React.createContext({
  plugin: null,
})

export class Searchable extends React.PureComponent<Props, State> {
  static defaultProps = {
    placeholder: 'Search...',
    defaultValue: '',
  }

  state = {
    filters: this.props.defaultFilters || [],
    focusedToken: -1,
    searchTerm: this.props.defaultValue,
    hasFocus: false,
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
    const node = findDOMNode(this) as HTMLDivElement
    if (node) {
      on(this, node, 'keydown', this.onKeyDown)
    } else {
      console.log('no searchable node!')
    }
    const { defaultFilters } = this.props
    let savedState
    let key = this.context.plugin + this.props.tableKey
    try {
      savedState = JSON.parse(window.localStorage.getItem(SEARCHABLE_STORAGE_KEY(key)) || 'null')
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
          const filterIndex = savedStateFilters.findIndex(f => f.key === defaultFilter.key)
          if (filterIndex > -1) {
            const next: TableFilter = defaultFilters[filterIndex]
            if (next.type === 'enum') {
              savedStateFilters[filterIndex].enum = next.enum
            }
            const filters = new Set(savedStateFilters[filterIndex].enum.map(filter => filter.value))
            savedStateFilters[filterIndex].value = savedStateFilters[filterIndex].value.filter(
              value => filters.has(value),
            )
          }
        })
      }
      this.setState({
        searchTerm: savedState.searchTerm || '',
        filters: savedState.filters || [],
      })
    }
  }

  componentDidUpdate(props: Props, prevState: State) {
    if (
      this.context.plugin &&
      (prevState.searchTerm !== this.state.searchTerm || prevState.filters !== this.state.filters)
    ) {
      if (props.onChangeSearch) {
        props.onChangeSearch(this.state.searchTerm)
      }
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
    window.document.removeEventListener('keydown', this.onKeyDown as any)
  }

  onKeyDown = (e: React.KeyboardEvent<any>) => {
    const ctrlOrCmd = e =>
      (e.metaKey && process.platform === 'darwin') || (e.ctrlKey && process.platform !== 'darwin')

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
        this.state.filters.length > 0 &&
        !this.state.filters[this.state.filters.length - 1].persistent
      ) {
        this._inputRef.blur()
        this.setState({ focusedToken: this.state.filters.length - 1 })
      } else {
        this.removeFilter(this.state.focusedToken)
      }
    } else if (e.key === 'Delete' && this.hasFocus() && this.state.focusedToken > -1) {
      this.removeFilter(this.state.focusedToken)
    } else if (e.key === 'Enter' && this.hasFocus() && this._inputRef) {
      if (this.props.onEnter) {
        this.props.onEnter(this.state.searchTerm)
      }
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
        const separator = filter.indexOf(':') > filter.indexOf('=') ? ':' : '='
        let [key, ...values] = filter.split(separator)
        let value = values.join(separator).trim()
        let type: FilterIncludeExclude = 'include'
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

  addFilter = (filter: TableFilter) => {
    const filterIndex = this.state.filters.findIndex(f => f.key === filter.key)
    if (filterIndex > -1) {
      const filters = [...this.state.filters]
      const defaultFilter: TableFilter = this.props.defaultFilters[filterIndex]
      if (
        defaultFilter != null &&
        defaultFilter.type === 'enum' &&
        filters[filterIndex].type === 'enum'
      ) {
        filters[filterIndex]['enum'] = defaultFilter.enum
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

  replaceFilter = (index: number, filter: TableFilter) => {
    const filters = [...this.state.filters]
    filters.splice(index, 1, filter)
    this.setState({ filters })
  }

  onInputFocus = () =>
    this.setState({
      focusedToken: -1,
      hasFocus: true,
    })

  onInputBlur = () => {
    setTimeout(
      () =>
        this.setState({
          hasFocus: false,
        }),
      100,
    )
  }

  onTokenFocus = (focusedToken: number) => this.setState({ focusedToken })

  onTokenBlur = () => this.setState({ focusedToken: -1 })

  hasFocus = (): boolean => {
    return this.state.focusedToken !== -1 || this.state.hasFocus
  }

  clear = () =>
    this.setState({
      filters: this.state.filters.filter(f => f.persistent != null && f.persistent === true),
      searchTerm: '',
    })

  render() {
    const { placeholder, actions, searchInputProps, before, after, width, children } = this.props
    return children({
      addFilter: this.addFilter,
      searchTerm: this.state.searchTerm,
      searchBar: (
        <SearchInput
          placeholder={placeholder}
          actions={actions}
          before={before}
          after={after}
          width={width}
          clearable={!!this.state.searchTerm}
          onClickClear={this.clear}
          focusedToken={this.state.focusedToken}
          filters={this.state.filters}
          filterProps={{
            onFocus: this.onTokenFocus,
            onDelete: this.removeFilter,
            onReplace: this.replaceFilter,
            onBlur: this.onTokenBlur,
          }}
          onChange={this.onChangeSearchTerm}
          value={this.state.searchTerm}
          ref={this.inputRef}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          {...searchInputProps}
        />
      ),
      filters: this.state.filters,
    })
  }
}
