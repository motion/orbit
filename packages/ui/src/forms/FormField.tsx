import { Col, gloss, Row } from 'gloss'
import React, { useEffect, useState } from 'react'

import { getDataType } from '../helpers/getDataType'
import { Space } from '../Space'
import { SimpleText } from '../text/SimpleText'
import { DataType } from '../types'
import { View } from '../View/View'
import { CheckBoxField } from './CheckboxField'
import { useFormError } from './Form'
import { InputField } from './InputField'
import { Label } from './Label'

type RowProps = {
  label?: React.ReactNode
}

const TableCell = gloss(View, {
  padding: [4, 0],
  marginBottom: 'auto',
})

const FormTableRow = gloss(Row, {
  width: '100%',
  minHeight: 32,
  alignItems: 'center',
})

const FormTableLabel = ({ children }) => <TableCell width="30%">{children}</TableCell>

export const FormTableValue = ({ children }) => <TableCell width="70%">{children}</TableCell>

export type FormFieldLayout = 'horizontal' | 'vertical'

export type SimpleFormFieldProps = RowProps & {
  layout?: FormFieldLayout
  children?: React.ReactNode
  name?: string
}

export function SimpleFormField({ name, label, children, layout }: SimpleFormFieldProps) {
  const error = useFormError(`${label}`)

  const labelElement = (
    <Label width="100%" htmlFor={name}>
      {label}
    </Label>
  )

  const valueElement = (
    <Col>
      {children}
      {error && (
        <>
          <SimpleText alt="error">{error}</SimpleText>
        </>
      )}
    </Col>
  )

  if (layout === 'vertical') {
    return (
      <>
        {labelElement}
        {valueElement}
      </>
    )
  }

  return (
    <FormTableRow>
      <FormTableLabel>
        <Row flex={1} alignItems="center">
          {labelElement}
          <Space />
        </Row>
      </FormTableLabel>
      <FormTableValue>{valueElement}</FormTableValue>
    </FormTableRow>
  )
}

type FormFieldProps =
  | {
      type?: DataType
      label: React.ReactNode
      value: any
      name?: string
      layout?: FormFieldLayout
    }
  | {
      type?: DataType
      label: React.ReactNode
      defaultValue: any
      name?: string
      layout?: FormFieldLayout
    }
  | {
      label: React.ReactNode
      children: React.ReactNode
      type?: undefined
      name?: string
      layout?: FormFieldLayout
    }

export function FormField(props: FormFieldProps) {
  let val = null
  if ('defaultValue' in props) {
    val = props.defaultValue
  } else if ('value' in props) {
    val = props.value
  }
  const type = props.type || getDataType(val)
  const [name, setName] = useState(props.name || `field-${type}-${Math.random()}`)

  useEffect(() => {
    props.name && setName(props.name)
  }, [props.name])

  switch (type) {
    case DataType.boolean:
      return <CheckBoxField name={name} {...props as any} />
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
