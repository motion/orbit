import { gloss, Row, View } from '@o/gloss'
import React, { forwardRef } from 'react'
import { ClearButton } from '../buttons/ClearButton'
import { Icon } from '../Icon'
import { FilterToken } from '../tables/FilterToken'
import { TableInput } from '../tables/TableInput'
import { TableFilter } from '../tables/types'
import { Input, InputProps } from './Input'

export type SearchInputProps = InputProps & {
  before?: React.ReactNode
  searchBarProps?: Object
  after?: React.ReactNode
  actions?: React.ReactNode
  filters?: TableFilter[]
  onClickClear?: Function
  focusedToken?: number
  filterProps?: Object
  clearable?: boolean
}

export const SearchInput = forwardRef<HTMLTextAreaElement, SearchInputProps>(function SearchInput(
  {
    width = '100%',
    before = null,
    placeholder = null,
    searchBarProps = null,
    after = null,
    actions = null,
    filters = [],
    onClickClear = null,
    focusedToken = null,
    filterProps = null,
    value = null,
    flex = null,
    padding = 0,
    clearable,
    ...props
  },
  ref,
) {
  const clearVisible = typeof clearable === 'boolean' ? clearable : value && !!value.length
  return (
    <SearchBar
      position="relative"
      zIndex="1"
      key="searchbar"
      flex={flex}
      padding={padding}
      {...searchBarProps}
    >
      {before}
      <SearchBox width={width} tabIndex={-1} background={props.background}>
        <SearchIcon opacity={0.8} transform={{ y: -0.5 }} name="ui-1_zoom" size={16} />
        {filters.map((filter, i) => (
          <FilterToken
            key={`${filter.key}:${filter.type}${i}`}
            index={i}
            filter={filter}
            focused={i === focusedToken}
            {...filterProps}
          />
        ))}
        <Input chromeless padding={0} placeholder={placeholder} ref={ref} {...props} />
        <SearchClearButton
          onClick={onClickClear}
          visible={clearVisible}
          opacity={1}
          position="relative"
          zIndex={2}
          marginLeft={5}
        />
      </SearchBox>
      {after}
      {actions != null ? <Actions>{actions}</Actions> : null}
    </SearchBar>
  )
})

const SearchClearButton = gloss(ClearButton, {
  opacity: 0,
  pointerEvents: 'none',
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
})

const Actions = gloss(Row, {
  marginLeft: 8,
  flexShrink: 0,
})

export const SearchInnerInput = gloss(TableInput, {
  fontWeight: 400,
  fontSize: 14,
  padding: 0,
  paddingBottom: 1, // fixes visual height
  flex: 1,
  background: 'transparent',
  height: '100%',
  maxWidth: '100%',
  width: 'calc(100% - 30px)',
  lineHeight: '100%',
  marginLeft: 2,
}).theme(({ focus }, theme) => ({
  color: theme.color,
  border: focus ? '1px solid black' : 0,
}))

export const SearchIcon = gloss(Icon, {
  margin: [0, 6, 0],
  minWidth: 16,
})

const SearchBar = gloss(Row, {
  maxHeight: 40,
  minHeight: 22,
  padding: 5,
  alignItems: 'center',
})

const SearchBox = gloss(View, {
  position: 'relative',
  flexFlow: 'row',
  borderRadius: '999em',
  height: '100%',
  flex: 1,
  alignItems: 'center',
  paddingLeft: 4,
  paddingRight: 30, // for clear button
  minHeight: 32,
  '&:focus-within': {
    boxShadow: `0 0 0 2px rgba(0,0,0,0.05)`,
  },
}).theme((props, theme) => ({
  background: props.background || theme.background,
  border: [1, theme.borderColor],
}))
