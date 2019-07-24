import { selectDefined } from '@o/utils'
import { gloss, useTheme } from 'gloss'
import React, { forwardRef } from 'react'

import { Button, ButtonProps } from '../buttons/Button'
import { FilterToken } from '../tables/FilterToken'
import { TableFilter } from '../tables/types'
import { Row } from '../View/Row'
import { Input, InputProps } from './Input'

export type SearchInputProps = InputProps & {
  actions?: React.ReactNode
  filters?: TableFilter[]
  onClickClear?: InputProps['onClick']
  focusedToken?: number
  filterProps?: Object
  clearable?: boolean
}

export const SearchInput = forwardRef<HTMLTextAreaElement, SearchInputProps>(function SearchInput(
  {
    width = '100%',
    before = null,
    placeholder = null,
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
  const theme = useTheme()
  return (
    <Input
      ref={ref}
      sizeRadius={selectDefined(theme.searchInputSizeRadius, 3)}
      flex={1}
      icon="search"
      placeholder="Search..."
      flexWrap="wrap"
      betweenIconElement={
        <Row space="xs">
          {filters.map((filter, i) => (
            <FilterToken
              key={`${filter.key}:${filter.type}${i}`}
              index={i}
              filter={filter}
              focused={i === focusedToken}
              {...filterProps}
            />
          ))}
        </Row>
      }
      after={
        <>
          <ClearButton onClick={onClickClear} invisible={!clearVisible} />
          {after}
          {!!actions && <Actions space="xs">{actions}</Actions>}
        </>
      }
      elementProps={{
        minWidth: 100,
      }}
      {...props}
    />
  )
})

export const ClearButton = gloss<ButtonProps & { invisible?: boolean }>(Button, {
  opacity: 1,
  pointerEvents: 'none',
  invisible: {
    opacity: 0,
    pointerEvents: 'auto',
  },
})

ClearButton.defaultProps = {
  icon: 'cross',
  circular: true,
  size: 0.65,
  sizeIcon: 1.2,
  alt: 'flat',
  glint: false,
  glintBottom: false,
}

const Actions = gloss(Row, {
  marginLeft: 8,
  flexShrink: 0,
})
