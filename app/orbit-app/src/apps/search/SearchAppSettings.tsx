import { Button, FormRow, HorizontalSpace, Row, SubTitle } from '@mcro/ui'
import React from 'react'
import { Input } from '../../views/Input'
import { SearchApp } from './types'

export default function SearchAppSettings(_: { app: SearchApp }) {
  return (
    <>
      <SubTitle>Filters</SubTitle>

      <FormRow
        label={
          <select style={{ width: '100%' }}>
            <option>Date</option>
          </select>
        }
      >
        <Row alignItems="center">
          <Input />
          <HorizontalSpace />
          <Button circular icon="add" />
        </Row>
      </FormRow>
    </>
  )
}
