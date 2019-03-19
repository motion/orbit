import { color } from '@o/color'
import { CSSPropertySet, gloss, Row, ThemeContext, View } from '@o/gloss'
import * as React from 'react'
import { ClearButton } from '../buttons/ClearButton'
import { Icon } from '../Icon'
import { FilterToken } from '../tables/FilterToken'
import { TableInput } from '../tables/TableInput'
import { TableFilter } from '../tables/types'

export type SearchInputProps = React.HTMLAttributes<HTMLInputElement> &
  CSSPropertySet & {
    before?: React.ReactNode
    searchBarProps?: Object
    after?: React.ReactNode
    actions?: React.ReactNode
    filters?: TableFilter[]
    onClickClear?: Function
    focusedToken?: number
    filterProps?: Object
    visible?: boolean
  }

export const SearchInput = React.forwardRef<HTMLTextAreaElement, SearchInputProps>(
  function SearchInput(
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
      visible,
      ...props
    },
    ref,
  ) {
    const { activeTheme } = React.useContext(ThemeContext)
    const clearVisible = typeof visible === 'boolean' ? visible : value && !!value.length
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
          <SearchIcon
            name="ui-1_zoom"
            color={activeTheme.color ? color(activeTheme.color).alpha(0.5) : '#555'}
          />
          {filters.map((filter, i) => (
            <FilterToken
              key={`${filter.key}:${filter.type}${i}`}
              index={i}
              filter={filter}
              focused={i === focusedToken}
              {...filterProps}
            />
          ))}
          <SearchInnerInput placeholder={placeholder} ref={ref} {...props} />
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
  },
)

const SearchClearButton = gloss(ClearButton, {
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
  minHeight: 32,
  '&:focus-within': {
    boxShadow: `0 0 0 2px rgba(0,0,0,0.05)`,
  },
}).theme((props, theme) => ({
  background: props.background || theme.background,
  border: [1, theme.borderColor],
}))
