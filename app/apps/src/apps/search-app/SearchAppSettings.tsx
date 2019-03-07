import { AppProps } from '@o/kit';
import { Button, FormRow, HorizontalSpace, Input, Row, SubTitle } from '@o/ui';
import React from 'react';

export function SearchAppSettings(_: AppProps) {
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
