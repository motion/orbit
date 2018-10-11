import * as React from 'react'
import { view } from '@mcro/black'
import { Row } from '../blocks/Row'
import { TableInput } from '../table/TableInput'
import { colors } from '../helpers/colors'
import { View } from '../blocks/View'
import { Icon } from '../Icon'
import { FilterToken } from '../table/FilterToken'
import { ClearButton } from '../buttons/ClearButton'
import { Filter } from '../table/types'
import { attachTheme } from '@mcro/gloss'

const SearchClearButton = view(ClearButton, {
  position: 'absolute',
  right: 6,
  top: '50%',
  marginTop: -9,
  opacity: 0,
  pointerEvents: 'none',
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
})

const Actions = view(Row, {
  marginLeft: 8,
  flexShrink: 0,
})

export const SearchInnerInput = view(TableInput, {
  fontWeight: 400,
  fontSize: 14,
  padding: 0,
  paddingBottom: 1, // fixes visual height
  flexGrow: 1,
  background: 'transparent',
  height: '100%',
  maxWidth: '100%',
  width: 'calc(100% - 30px)',
  lineHeight: '100%',
  marginLeft: 2,
  '&::-webkit-input-placeholder': {
    color: colors.placeholder,
    fontWeight: 300,
  },
}).theme(({ focus, theme }) => ({
  color: theme.color,
  border: focus ? '1px solid black' : 0,
  '&::-webkit-input-placeholder': {
    color: theme.color,
  },
}))

export const SearchIcon = view(Icon, {
  margin: [-1, 6, 0],
  minWidth: 16,
})

const SearchBar = view(Row, {
  height: '100%',
  maxHeight: 40,
  padding: 5,
  alignItems: 'center',
})

export const SearchBox = view(View, {
  position: 'relative',
  flexFlow: 'row',
  borderRadius: '999em',
  height: '100%',
  flex: 1,
  alignItems: 'center',
  paddingLeft: 4,
  '&:focus-within': {
    boxShadow: `0 0 0 2px rgba(255,255,255,0.2)`,
  },
}).theme(({ theme }) => ({
  background: theme.background,
  border: [1, theme.borderColor],
}))

export const SearchInput = attachTheme(
  ({
    width = '100%' as string | number,
    before = null,
    placeholder = null,
    searchBarProps = null,
    searchInputProps = null,
    after = null,
    actions = null,
    filters = [] as Filter[],
    visible = false,
    onClickClear = null,
    focusedToken = null,
    filterProps = null,
    theme = null,
  }) => (
    <SearchBar position="relative" zIndex="1" key="searchbar" {...searchBarProps}>
      {before}
      <SearchBox width={width} tabIndex={-1}>
        <SearchIcon
          name="ui-1_zoom"
          // @ts-ignore
          color={theme.color.alpha(0.5)}
          size={16}
        />
        {filters.map((filter, i) => (
          <FilterToken
            key={`${filter.key}:${filter.type}`}
            index={i}
            filter={filter}
            focused={i === focusedToken}
            {...filterProps}
          />
        ))}
        <SearchInnerInput placeholder={placeholder} {...searchInputProps} />
        <SearchClearButton
          onClick={onClickClear}
          visible={visible}
          position="relative"
          zIndex={2}
          // weirdly this fixes a strange overlap bug
          flex={1}
          marginLeft={5}
        />
      </SearchBox>
      {after}
      {actions != null ? <Actions>{actions}</Actions> : null}
    </SearchBar>
  ),
)
