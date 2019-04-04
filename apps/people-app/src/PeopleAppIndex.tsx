import { List, LocationLink, useBits, useLocationLink } from '@o/kit'
import { Button, Paragraph, Space, SubTitle, Title, View } from '@o/ui'
import React, { useCallback } from 'react'

export function PeopleAppIndex() {
  return (
    <List
      shareable
      selectable="multi"
      items={useBits({ type: 'person' })}
      removePrefix="@"
      sortBy={useCallback(x => x.title.toLowerCase(), [])}
      groupByLetter
      groupMinimum={12}
      placeholder={
        <View flex={1} padding={20}>
          <Title>Directory Empty</Title>
          <Paragraph>
            To see your contacts, add an app that syncs people from your{' '}
            <LocationLink url="apps">workspace settings</LocationLink>.
          </Paragraph>

          <View alignItems="center" justifyContent="center" flex={1}>
            <SubTitle>No items.</SubTitle>
            <Space />
            <Button onClick={useLocationLink('search')} size={1.2}>
              Search all
            </Button>
          </View>
        </View>
      }
    />
  )
}
