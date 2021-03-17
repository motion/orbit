// @ts-nocheck
import { ensure, react, syncFromProp, syncToProp, useStore } from '@o/use-store'
import { isDefined } from '@o/utils'
import { capitalize } from 'lodash'
import React, { memo, Ref, useEffect, useRef } from 'react'

import { SearchInput, SearchInputProps } from '../forms/SearchInput'
import { textContent } from '../helpers/textContent'
import { GenericDataRow } from '../types'
import { FilterIncludeExclude, TableFilter, TableFilterSimple, TableRows } from './types'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
export type FilterableProps = {
  addFilter?: (filter: TableFilter) => void
  searchable?: boolean
  query?: string
  filters?: TableFilterSimple[]
  defaultFilters?: TableFilterSimple[]
  onEnter?: (value: string) => any
  onFilterChange?: (filters: TableFilter[]) => void
}

export type FilterableReceiverProps = {
  /** Value to filter rows on. Alternative to the `filter` prop */
  filterValue?: string
  /** Callback to filter rows */
  filter?: (row: GenericDataRow) => boolean
  /** Initial filters (uncontrolled) */
  defaultFilters?: TableFilter[]
}

// allows for optional label
const EMPTY_FILTERS = []
function normalizeFilters(filters: TableFilterSimple[]): TableFilter[] {
  return filters ? filters.map(normalizeFilter) : EMPTY_FILTERS
}

const themeColors = ['orange', 'red', 'blue', 'green', 'yellow']
const randomColor = (index: number) => themeColors[index % (themeColors.length - 1)]

function normalizeFilter(filter: TableFilterSimple): TableFilter {
  if (filter.type === 'columns') {
    if (filter.options.some(x => typeof x === 'string' || !isDefined(x.label))) {
      return {
        ...filter,
        options: (filter.options as any).map((x, i) =>
          typeof x === 'string'
            ? { label: capitalize(x), value: x, color: randomColor(i) }
            : {
                label: capitalize(x.value),
                value: x.value,
                color: x.color,
              },
        ),
      }
    }
  }
  return filter as any
}

class FilterableStore {
  props: FilterableProps

  filters = syncFromProp(this.props, {
    key: 'filters',
    defaultKey: 'defaultFilters',
    defaultValue: [],
    normalize: normalizeFilters,
  })

  onFilterChange = syncToProp(this, 'filters', 'onFilterChange')

  query = syncFromProp(this.props, {
    key: 'query',
    defaultKey: 'defaultQuery',
    defaultValue: [],
  })

  focusedToken = -1
  inputFocused = false
  inputNode: HTMLInputElement = null

  filter = react(
    () => [this.filters, this.query],
    ([filters, query]) => {
      return filterRowsFactory(filters, query)
    },
  )

  inputListener = react(
    () => this.inputNode,
    (node, { useEffect }) => {
      ensure('node', !!node)
      useEffect(() => {
        node.addEventListener('keydown', this.onKeyDown)
        return () => node.removeEventListener('keydown', this.onKeyDown)
      })
    },
  )

  onKeyDown = (e: KeyboardEvent) => {
    const ctrlOrCmd = e =>
      (e.metaKey && process.platform === 'darwin') || (e.ctrlKey && process.platform !== 'darwin')
    if (e.key === 'f' && ctrlOrCmd(e) && this.inputNode) {
      e.preventDefault()
      if (this.inputNode) {
        this.inputNode.focus()
      }
    } else if (e.key === 'Escape' && this.inputNode) {
      this.inputNode.blur()
      this.query = ''
    } else if (e.key === 'Backspace' && this.hasFocus) {
      if (
        this.focusedToken === -1 &&
        this.query === '' &&
        this.inputNode &&
        this.filters.length > 0 &&
        !this.filters[this.filters.length - 1].persistent
      ) {
        this.inputNode.blur()
        this.focusedToken = this.filters.length - 1
      } else {
        this.removeFilter(this.focusedToken)
      }
    } else if (e.key === 'Delete' && this.hasFocus && this.focusedToken > -1) {
      this.removeFilter(this.focusedToken)
    } else if (e.key === 'Enter' && this.hasFocus && this.inputNode) {
      if (this.props.onEnter) {
        this.props.onEnter(this.query)
      }
      this.matchTags(this.inputNode.value, true)
    }
  }

  onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.matchTags(e.target.value, false)
  }

  matchTags = (query: string, matchEnd: boolean) => {
    const filterPattern = matchEnd
      ? /([a-z][a-z0-9]*[!]?[:=][^\s]+)($|\s)/gi
      : /([a-z][a-z0-9]*[!]?[:=][^\s]+)\s/gi
    const match = query.match(filterPattern)
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

      query = query.replace(filterPattern, '')
    }
    this.query = query
  }

  addFilter = (filter: TableFilter) => {
    const filterIndex = this.filters.findIndex(f => f.key === filter.key)
    if (filterIndex > -1) {
      const filters = [...this.filters]
      const defaultFilter: TableFilter = normalizeFilter(this.props.defaultFilters[filterIndex])
      if (
        defaultFilter != null &&
        defaultFilter.type === 'columns' &&
        filters[filterIndex].type === 'enum'
      ) {
        filters[filterIndex].options = defaultFilter.options
      }
      this.filters = filters
      // filter for this key already exists
      return
    }
    // persistent filters are always at the front
    this.filters =
      filter.persistent === true ? [filter, ...this.filters] : this.filters.concat(filter)
    this.focusedToken = -1
  }

  removeFilter = (index: number) => {
    this.focusedToken = -1
    this.filters = this.filters.filter((_, i) => i !== index)
    if (this.inputNode) {
      this.inputNode.focus()
    }
  }

  replaceFilter = (index: number, filter: TableFilter) => {
    const filters = [...this.filters]
    filters.splice(index, 1, filter)
    this.filters = filters
  }

  onInputFocus = () => {
    this.focusedToken = -1
    this.inputFocused = true
  }

  onInputBlur = () => {
    this.inputFocused = false
  }

  onTokenFocus = (focusedToken: number) => {
    this.focusedToken = focusedToken
  }

  onTokenBlur = () => {
    this.focusedToken = -1
  }

  get hasFocus() {
    return this.focusedToken !== -1 || this.inputFocused
  }

  clear = () => {
    this.filters = this.filters.filter(f => f.persistent != null && f.persistent === true)
    this.query = ''
  }

  inputProps = null
}

type UseFilterable = {
  ref: Ref<HTMLInputElement>
  store: FilterableStore
  filter: (row: GenericDataRow) => boolean
  onAddFilter: (fitler: TableFilter) => void
}

export function useFilterable(props: FilterableProps): UseFilterable {
  const ref = useRef<HTMLInputElement>(null)
  const store = useStore(FilterableStore, props)

  useEffect(() => {
    if (!ref.current) {
      console.debug('No input ref provided to useFilterable, can be on purpose')
    }
    store.inputNode = ref.current
  }, [ref])

  return {
    ref,
    store,
    filter: store.filter,
    onAddFilter: store.addFilter,
  }
}

export const FilterableSearchInput = memo(
  ({ useFilterable, ...rest }: SearchInputProps & { useFilterable: UseFilterable }) => {
    const { store } = useFilterable
    return (
      <SearchInput
        placeholder="Search..."
        nodeRef={useFilterable.ref}
        clearable={!!store.query}
        onClickClear={store.clear}
        focusedToken={store.focusedToken}
        // @ts-ignore
        filters={store.filters}
        filterProps={{
          onFocus: store.onTokenFocus,
          onDelete: store.removeFilter,
          onReplace: store.replaceFilter,
          onBlur: store.onTokenBlur,
        }}
        onChange={store.onChangeQuery}
        value={store.query}
        onFocus={store.onInputFocus}
        onBlur={store.onInputBlur}
        {...rest}
      />
    )
  },
)

const sep = '~~'
export const filterRowsFactory = (filters: TableFilter[], query: string) => (
  row: GenericDataRow,
): boolean => {
  const matchSearch =
    !!query && query.length
      ? Object.keys(row.values)
          .map(key => textContent(row.values[key]))
          .join(sep) // prevent from matching text spanning multiple columns
          .toLowerCase()
          .includes(query.toLowerCase())
      : true

  const matchFilter = filters
    .map((filter: TableFilter) => {
      const val = row.values[filter.key]
      if (filter.type === 'columns') {
        if (!filter.values.length) {
          return true
        }
        return filter.values.some(col => anyMatches(col, val))
      } else if (filter.type === 'include') {
        return anyMatches(filter.value.toLowerCase(), val)
      } else if (filter.type === 'exclude') {
        return anyMatches(filter.value.toLowerCase(), val) === false
      } else {
        return true
      }
    })
    .reduce((acc, cv) => acc && cv, true)

  return matchSearch && matchFilter
}

function anyMatches(needle: string, hayStack: any) {
  if (Array.isArray(hayStack)) {
    return hayStack.some(x => anyMatches(x, needle))
  } else {
    return hayStack === needle || textContent(hayStack).toLowerCase() === needle
  }
}

export const filterRows = (
  rows: TableRows,
  filterValue?: string,
  filter?: (row: GenericDataRow) => boolean,
): TableRows => {
  // check that we don't have a filter
  const hasFilterValue = filterValue !== '' && filterValue != null
  const hasFilter = hasFilterValue || typeof filter === 'function'
  if (!hasFilter) {
    return rows
  }
  let filteredRows = []
  if (hasFilter) {
    for (const row of rows) {
      let keep = false

      // check if this row's filterValue contains the current filter
      if (filterValue != null && !!row.filterValue) {
        keep = row.filterValue.includes(filterValue)
      }

      // call filter() prop
      if (keep === false && typeof filter === 'function') {
        keep = filter(row)
      }

      if (keep) {
        filteredRows.push(row)
      }
    }
  } else {
    filteredRows = rows
  }
  return filteredRows
}
