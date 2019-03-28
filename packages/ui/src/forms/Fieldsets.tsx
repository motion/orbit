import React from 'react'
import { getRowValues } from '../helpers/getRowValues'
import { SurfacePassProps } from '../Surface'
import { DataColumnsShort, GenericDataRow } from '../types'
import { Fieldset } from './Fieldset'
import { FormField } from './FormField'
import { guessColumns } from './guessColumns'

export type FieldsetsProps = { columns?: DataColumnsShort; rows: GenericDataRow[] | null }

export function Fieldsets(props: FieldsetsProps) {
  if (!props.rows || props.rows.length === 0) {
    return null
  }

  const columns = guessColumns(props.columns, props.rows[0])

  return (
    <SurfacePassProps size={1.1}>
      {props.rows.map(row => {
        const values = getRowValues(row)
        return (
          <Fieldset key={row.key}>
            {Object.keys(columns).map((colKey, index) => {
              const value = values[colKey]
              return (
                <FormField
                  key={`${value.key}${index}`}
                  type={columns[colKey].type}
                  label={columns[colKey].value}
                  value={value}
                />
              )
            })}
          </Fieldset>
        )
      })}
    </SurfacePassProps>
  )
}
