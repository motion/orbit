import { selectDefined } from '@o/utils'
import React, { useEffect, useState } from 'react'

import { getDataType } from '../helpers/getDataType'
import { DataType } from '../types'
import { InputField } from './InputField'
import { FormFieldLayout, SimpleFormField } from './SimpleFormField'
import { ToggleField } from './ToggleField'

type FormFieldProps =
  | {
      type?: DataType
      label: React.ReactNode
      value: any
      name?: string
      description?: string
      layout?: FormFieldLayout
    }
  | {
      type?: DataType
      label: React.ReactNode
      defaultValue: any
      name?: string
      description?: string
      layout?: FormFieldLayout
    }
  | {
      label: React.ReactNode
      children: React.ReactNode
      type?: undefined
      name?: string
      description?: string
      layout?: FormFieldLayout
    }

export function FormField(props: FormFieldProps) {
  let val = null
  if ('defaultValue' in props) {
    val = props.defaultValue
  } else if ('value' in props) {
    val = props.value
  }
  // default to string
  val = selectDefined(val, '')
  const type = props.type || getDataType(val)
  const [name, setName] = useState(props.name || `field-${type}-${Math.random()}`)

  useEffect(() => {
    props.name && setName(props.name)
  }, [props.name])

  switch (type) {
    case DataType.boolean:
      return <ToggleField name={name} {...props as any} />
    case DataType.date:
      // TODO calendar after input
      return <InputField name={name} type={type} {...props} />
    case DataType.number:
      return <InputField name={name} type={type} {...props} />
    case DataType.string:
      return <InputField name={name} type={type} width="100%" {...props} />
    case DataType.unknown:
    default:
      return <SimpleFormField {...props} />
  }
}
