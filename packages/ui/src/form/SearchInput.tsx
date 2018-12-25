import * as React from 'react'
import { Row } from '../blocks/Row'
import { TableInput } from '../table/TableInput'
import { colors } from '../helpers/colors'
import { View } from '../blocks/View'
import { ClearButton } from '../buttons/ClearButton'
import { Filter } from '../table/types'
import { ThemeObject, CSSPropertySet, ThemeContext, gloss } from '@mcro/gloss'
import { FilterToken } from '../table/FilterToken'
import { color } from '@mcro/color'
import { Icon } from '../Icon'

export type SearchInputProps = React.HTMLAttributes<HTMLInputElement> &
  CSSPropertySet & {
    before?: React.ReactNode
    searchBarProps?: Object
    after?: React.ReactNode
    actions?: React.ReactNode
    filters?: Filter[]
    onClickClear?: Function
    focusedToken?: number
    filterProps?: Object
    theme?: ThemeObject
    visible?: boolean
  }

export const SearchInput = ({
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
  padding = 5,
  visible,
  ...props
}: SearchInputProps) => {
  const { activeTheme } = React.useContext(ThemeContext)
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
      <SearchBox width={width} tabIndex={-1}>
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
        <SearchInnerInput placeholder={placeholder} {...props} />
        <SearchClearButton
          onClick={onClickClear}
          visible={typeof visible === 'boolean' ? visible : value && !!value.length}
          opacity={1}
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
  )
}

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
  '&::-webkit-input-placeholder': {
    color: colors.placeholder,
    fontWeight: 300,
  },
}).theme(({ focus }, theme) => ({
  color: theme.color,
  border: focus ? '1px solid black' : 0,
  '&::-webkit-input-placeholder': {
    color: theme.color,
  },
}))

export const SearchIcon = gloss(Icon, {
  margin: [0, 6, 0],
  minWidth: 16,
})

const SearchBar = gloss(Row, {
  height: '100%',
  maxHeight: 40,
  padding: 5,
  alignItems: 'center',
})

export const SearchBox = gloss(View, {
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
}).theme((_, theme) => ({
  background: theme.background,
  border: [1, theme.borderColor.alpha(0.5)],
}))
