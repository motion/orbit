import { List, useBits, useLocationLink, View } from '@o/kit'
import { Button, Space, SubTitle } from '@o/ui'
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
      placeholder={
        <View alignItems="center" justifyContent="center" padding={25} flex={1}>
          <SubTitle>Nothing loaded in directory.</SubTitle>
          <Space />
          <Button onClick={useLocationLink('search')} size={1.2}>
            Search Everything
          </Button>
        </View>
      }
    />
  )
}
