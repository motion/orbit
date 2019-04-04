import React from 'react'
import { DateFormat } from './text/DateFormat'
import { SimpleText } from './text/SimpleText'

export function DataValue(props: { type?: string; value: any }) {
  const { type, value } = props

  let element = null

  if (type === 'date') {
    element = (
      <SimpleText ellipse>
        <DateFormat date={value} />
      </SimpleText>
    )
  } else if (type === 'string') {
    element = <SimpleText ellipse>{value}</SimpleText>
  } else if (type === 'boolean') {
    element = <SimpleText fontWeight={500}>{value ? 'true' : 'false'}</SimpleText>
  } else {
    element = <SimpleText ellipse>{`${value}`}</SimpleText>
  }

  return element
}
