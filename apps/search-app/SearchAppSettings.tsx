import { Button, FormField, Input, Space, Stack, SubTitle } from '@o/ui'
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
        <Stack direction="horizontal" alignItems="center">
          <Input />
          <Space />
          <Button circular icon="plus" />
        </Stack>
      </FormField>
    </>
  )
}
