import React from 'react'
import { DataValue } from './DataValue'
import { guessColumns } from './forms/guessColumns'
import { Label } from './forms/Label'
import { getRowValues } from './helpers/getRowValues'
import { DataColumnsShort, DataType, GenericDataRow } from './types'

export type DefinitionListProps = {
  columns?: DataColumnsShort
  row: GenericDataRow | null
}

export function DefinitionList(props: DefinitionListProps) {
  const columns = guessColumns(props.columns, props.row)
  const values = getRowValues(props.row)

  return (
    <>
      {Object.keys(columns).map((colKey, index) => {
        const value = values[colKey]
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
    <>
      <Label fontWeight={400}>{props.label}</Label>:&nbsp;
      <DataValue type={props.type} value={props.value} />
    </>
  )
}
