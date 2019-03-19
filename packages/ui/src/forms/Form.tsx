import React from 'react'
import { SurfacePassProps } from '../Surface'
import { DataColumnsShort, GenericDataRow } from '../types'
import { Fieldset } from './Fieldset'
import { FormField } from './FormField'
import { guessColumns } from './guessColumns'

type FormProps = { columns?: DataColumnsShort; rows: GenericDataRow[] | null }

export function Form(props: FormProps) {
  if (!props.rows || props.rows.length === 0) {
    return null
  }

  const columns = guessColumns(props.columns, props.rows)

  return (
    <SurfacePassProps size={1.1}>
      {props.rows.map(row => {
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
