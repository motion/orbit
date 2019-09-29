import React from 'react'

import { useSurfaceHeight } from '../SizedSurface'
import { Space } from '../Space'
import { SimpleText } from '../text/SimpleText'
import { Stack, StackProps } from '../View/Stack'
import { useFormError } from './Form'
import { Label } from './Label'

const FormLabel = ({ children, height }) => (
  <Stack data-is="FormLabel" width="30%" maxWidth={120} height={height}>
    {children}
  </Stack>
)

const FormValueCol = (props: StackProps) => <Stack minWidth="70%" flex={1} space {...props} />

export type FormFieldLayout = 'horizontal' | 'vertical'

export type SimpleFormFieldProps = StackProps & {
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
      <Stack space="sm">
        {labelElement}
        {valueElement}
        {descriptionElement}
      </Stack>
    )
  }
  return (
    <Stack direction="horizontal" width="100%" alignItems="flex-start" padding="xs">
      <FormLabel height={height}>
        <Stack direction="horizontal" flex={1} alignItems="center">
          {labelElement}
          <Space />
        </Stack>
      </FormLabel>
      <FormValueCol space="sm">
        {valueElement}
        {descriptionElement}
      </FormValueCol>
    </Stack>
  )
}
