import { List, NoResultsDialog, useBits } from '@o/kit'
import React, { useCallback } from 'react'

export function PeopleAppIndex() {
  return (
    <List
      shareable
      items={useBits({ type: 'person' })}
      removePrefix="@"
      sortBy={useCallback(x => x.title.toLowerCase(), [])}
      groupByLetter
      groupMinimum={12}
      placeholder={<NoResultsDialog subName="the directory" />}
    />
  )
}
