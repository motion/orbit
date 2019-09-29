import { isDefined } from '@o/utils'
import React from 'react'

import { DataValue } from './DataValue'
import { guessColumns } from './forms/guessColumns'
import { Label } from './forms/Label'
import { getRowValues } from './helpers/getRowValues'
import { DataColumnsShort, DataType, GenericDataRow } from './types'
import { Stack } from './View/Stack'

export type DefinitionListProps = {
  columns?: DataColumnsShort
  row: GenericDataRow | null
  children?: React.ReactNode
}

export function DefinitionList(props: DefinitionListProps) {
  if (isDefined(props.children)) {
    return <>{props.children}</>
  }

  const columns = guessColumns(props.columns, props.row)
  const values = getRowValues(props.row)

  return (
    <>
      {Object.keys(columns).map((colKey, index) => {
        const value = values[colKey]
        if (!value) {
          return null
        }
        return (
          <DefinitionItem
            key={value.key || index}
            type={columns[colKey].type}
            label={columns[colKey].value}
            value={value}
          />
        )
      })}
    </>
  )
}

export type DefinitionItem = {
  type?: DataType
  label?: string
  value?: any
}

export function DefinitionItem(props: DefinitionItem) {
  return (
    <Stack direction="horizontal" alignItems="center">
      <Label padding={0} fontWeight={400}>
        {props.label}:
      </Label>
      &nbsp;
      <DataValue type={props.type} value={props.value} />
    </Stack>
  )
}
