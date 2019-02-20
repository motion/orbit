import { Row } from '@mcro/gloss'
import React from 'react'
import { HorizontalSpace } from '../layout/HorizontalSpace'
import { FormTableLabel, FormTableRow, FormTableValue, RowProps } from '../tables/Table'
import { Label } from './Label'

export const FormRow = ({ label, children }: RowProps & { children?: React.ReactNode }) => (
  <FormTableRow>
    <FormTableLabel>
      <Row flex={1} alignItems="center">
        <Label>{label}</Label>
        <HorizontalSpace />
      </Row>
    </FormTableLabel>
    <FormTableValue>{children}</FormTableValue>
  </FormTableRow>
)
