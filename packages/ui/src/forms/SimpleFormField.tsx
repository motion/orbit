import { Row } from 'gloss'
import React from 'react'

import { useSurfaceHeight } from '../SizedSurface'
import { Space } from '../Space'
import { SimpleText } from '../text/SimpleText'
import { Col, ColProps } from '../View/Col'
import { useFormError } from './Form'
import { Label } from './Label'

const FormLabel = ({ children, height }) => (
  <Col data-is="FormLabel" width="30%" maxWidth={120} height={height}>
    {children}
  </Col>
)

const FormValueCol = (props: ColProps) => <Col minWidth="70%" flex={1} space {...props} />

export type FormFieldLayout = 'horizontal' | 'vertical'

export type SimpleFormFieldProps = ColProps & {
  description?: string
  label?: React.ReactNode
  layout?: FormFieldLayout
  children?: React.ReactNode
  name?: string
}

export function SimpleFormField({
  name,
  label,
  children,
  layout,
  description,
}: SimpleFormFieldProps) {
  const error = useFormError(`${label}`)
  const height = useSurfaceHeight(1)
  const descriptionElement = (
    <SimpleText size="sm" alpha={0.8}>
      {description}
    </SimpleText>
  )
  const labelElement = (
    <Label width="100%" htmlFor={name}>
      {label}
    </Label>
  )
  const valueElement = (
    <>
      {children}
      {error && (
        <>
          <SimpleText coat="error">{error}</SimpleText>
        </>
      )}
    </>
  )
  if (layout === 'vertical') {
    return (
      <Col space="sm">
        {labelElement}
        {valueElement}
        {descriptionElement}
      </Col>
    )
  }
  return (
    <Row width="100%" alignItems="flex-start" padding="xs">
      <FormLabel height={height}>
        <Row flex={1} alignItems="center">
          {labelElement}
          <Space />
        </Row>
      </FormLabel>
      <FormValueCol space="sm">
        {valueElement}
        {descriptionElement}
      </FormValueCol>
    </Row>
  )
}
