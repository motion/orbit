import { SearchApp } from '@mcro/models'
import { Button, Row } from '@mcro/ui'
import React from 'react'
import { FormRow, HorizontalSpace, SubTitle } from '../../views'
import { Input } from '../../views/Input'

export default function SearchAppSettings(props: { app: SearchApp }) {
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
