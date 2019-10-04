import React from 'react'

import { getRowValues } from '../helpers/getRowValues'
import { SurfacePassProps } from '../SurfacePropsContext'
import { DataColumnsShort, GenericDataRow } from '../types'
import { Fieldset } from './Fieldset'
import { FormField } from './FormField'
import { guessColumns } from './guessColumns'

export type FieldsetsProps = {
  columns?: DataColumnsShort
  items: GenericDataRow[] | null
}

export function Fieldsets(props: FieldsetsProps) {
  if (!props.items || props.items.length === 0) {
    return null
  }

  const columns = guessColumns(props.columns, props.items[0])

  return (
    <SurfacePassProps size={1.1}>
      {props.items.map((row, rowIndex) => {
        const values = getRowValues(row)
        return (
          <Fieldset key={`${row.key}${rowIndex}`}>
            {Object.keys(columns).map((colKey, colIndex) => {
              const value = values[colKey]
              return (
                <FormField
                  key={`${value.key}${colIndex}`}
                  type={columns[colKey].type}
                  label={columns[colKey].value}
                  defaultValue={value}
                />
              )
            })}
          </Fieldset>
        )
      })}
    </SurfacePassProps>
  )
}
