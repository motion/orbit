import { Row } from '@o/gloss'
import React, { useEffect, useState } from 'react'
import { HorizontalSpace } from '../layout/HorizontalSpace'
import { FormTableLabel, FormTableRow, FormTableValue, RowProps } from '../tables/Table'
import { DataType } from '../types'
import { CheckBoxField } from './CheckboxField'
import { InputField } from './InputField'
import { Label } from './Label'

export type SimpleFormFieldProps = RowProps & {
  children?: React.ReactNode
  name?: string
}

export function SimpleFormField({ name, label, children }: SimpleFormFieldProps) {
  return (
    <FormTableRow>
      <FormTableLabel>
        <Row flex={1} alignItems="center">
          <Label htmlFor={name}>{label}</Label>
          <HorizontalSpace />
        </Row>
      </FormTableLabel>
      <FormTableValue>{children}</FormTableValue>
    </FormTableRow>
  )
}

type FormFieldProps = {
  type: DataType
  label: React.ReactNode
  value: any
  name?: string
}

export function FormField({ type, ...props }: FormFieldProps) {
  const [name, setName] = useState(props.name || `field-${type}-${Math.random()}`)

  useEffect(
    () => {
      props.name && setName(props.name)
    },
    [props.name],
  )

  switch (type) {
    case DataType.boolean:
      return <CheckBoxField name={name} {...props} />
    case DataType.date:
      // TODO calendar option after input
      return <InputField name={name} {...props} />
    case DataType.number:
      return <InputField name={name} {...props} />
    case DataType.string:
      return <InputField name={name} {...props} />
    case DataType.unknown:
    default:
      console.error('Unknown data type to render', type, props)
      return null
  }
}
