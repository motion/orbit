import { Button, FormField, Input, Row, Space, SubTitle } from '@o/ui'
import React from 'react'

export function SearchAppSettings() {
  return (
    <>
      <SubTitle>Filters</SubTitle>
      <FormField
        label={
          <select style={{ width: '100%' }}>
            <option>Date</option>
          </select>
        }
      >
        <Row alignItems="center">
          <Input />
          <Space />
          <Button circular icon="plus" />
        </Row>
      </FormField>
    </>
  )
}
