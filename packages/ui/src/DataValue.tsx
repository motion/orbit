import { gloss } from 'gloss'
import React from 'react'

import { DateFormat } from './text/DateFormat'
import { SimpleText } from './text/SimpleText'

const DataText = gloss(SimpleText)

DataText.defaultProps = {
  alpha: 0.85,
  size: 0.85,
}

export function DataValue(props: { type?: string; value: any }) {
  const { type, value } = props
  let element = null
  if (type === 'date') {
    element = (
      <DataText ellipse>
        <DateFormat date={value} />
      </DataText>
    )
  } else if (type === 'string') {
    element = <DataText ellipse>{value}</DataText>
  } else if (type === 'boolean') {
    element = <DataText fontWeight={500}>{value ? 'true' : 'false'}</DataText>
  } else {
    element = <DataText ellipse>{`${value}`}</DataText>
  }
  return element
}
