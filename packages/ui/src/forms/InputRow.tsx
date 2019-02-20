import React, { forwardRef } from 'react'
import { FormTableLabel, FormTableRow, FormTableValue, RowProps } from '../tables/Table'
import { Input, InputProps } from './Input'
import { Label } from './Label'

export const InputRow = forwardRef(
  ({ label, type = 'input', ...props }: InputProps & RowProps, ref) => (
    <FormTableRow>
      <FormTableLabel>
        <Label>{label}</Label>
      </FormTableLabel>
      <FormTableValue>
        <Input ref={ref as any} type={type} {...props} />
      </FormTableValue>
    </FormTableRow>
  ),
)
