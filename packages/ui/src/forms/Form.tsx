import React from 'react'
import { SurfacePassProps } from '../Surface'
import { DataColumns, GenericDataRow } from '../types'
import { Fieldset } from './Fieldset'
import { FormField } from './FormField'

type FormProps = { columns: DataColumns; rows: GenericDataRow[] | null }

export function Form({ columns, rows }: FormProps) {
  if (!rows || rows.length === 0) {
    return null
  }

  return (
    <SurfacePassProps size={1.1}>
      {rows.map(row => {
        return (
          <Fieldset key={row.key}>
            {Object.keys(row.values).map(valKey => {
              const value = row.values[valKey]
              return (
                <FormField
                  key={value.key}
                  type={columns[valKey].type}
                  label={columns[valKey].value}
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
