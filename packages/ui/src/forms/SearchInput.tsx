import { selectDefined } from '@o/utils'
import { gloss, useTheme } from 'gloss'
import React from 'react'

import { Button, ButtonProps } from '../buttons/Button'
import { FilterToken } from '../tables/FilterToken'
import { TableFilter } from '../tables/types'
import { Stack } from '../View/Stack'
import { Input, InputProps } from './Input'

export type SearchInputProps = InputProps & {
  actions?: React.ReactNode
  filters?: TableFilter[]
  onClickClear?: InputProps['onClick']
  focusedToken?: number
  filterProps?: Object
  clearable?: boolean
}

export function SearchInput({
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
}: SearchInputProps) {
  const clearVisible = typeof clearable === 'boolean' ? clearable : value && !!value.length
  const theme = useTheme({
    subTheme: 'searchInput',
  })
  return (
    <Input
      sizeRadius={selectDefined(theme.sizeRadius, 3)}
      flex={1}
      icon="search"
      placeholder="Search..."
      flexWrap="wrap"
      betweenIconElement={
        <Stack direction="horizontal" space="xs">
          {filters.map((filter, i) => (
            <FilterToken
              key={`${filter.key}:${filter.type}${i}`}
              index={i}
              filter={filter}
              focused={i === focusedToken}
              {...filterProps}
            />
          ))}
        </Stack>
      }
      after={
        <>
          <ClearButton onClick={onClickClear} invisible={!clearVisible} />
          {after}
          {!!actions && (
            <Actions direction="horizontal" space="xs">
              {actions}
            </Actions>
          )}
        </>
      }
      elementProps={{
        minWidth: 100,
      }}
      {...props}
    />
  )
}

export const ClearButton = gloss<ButtonProps & { invisible?: boolean }>(Button, {
  icon: 'cross',
  circular: true,
  size: 0.75,
  sizeIcon: 1.5,
  coat: 'flat',
  glint: false,
  glintBottom: false,
  opacity: 1,
  pointerEvents: 'none',

  conditional: {
    invisible: {
      opacity: 0,
      pointerEvents: 'auto',
    },
  },
})

const Actions = gloss(Stack, {
  marginLeft: 8,
  flexShrink: 0,
})
