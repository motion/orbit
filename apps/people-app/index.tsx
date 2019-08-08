import { AppNavigator, AppViewProps, createApp, LocationLink, NavigatorProps, useBitSearch, useLocationLink } from '@o/kit'
import { Button, Center, List, Paragraph, Section, SubTitle } from '@o/ui'
import React, { useCallback } from 'react'

import { PersonMedia } from './PersonMedia'

export default createApp({
  id: 'people',
  name: 'People',
  icon: 'person',
  iconColors: ['rgb(133, 20, 75)', 'rgb(123, 10, 65)'],
  itemType: 'person',
  app: () => <AppNavigator index={PeopleAppIndex} detail={PeopleAppMain} />,
})

function PeopleAppIndex(props: NavigatorProps) {
  const people = useBitSearch({
    type: 'person',
    excludeData: true,
    where: { title: { $not: { $equal: '' } } },
  })
  return (
    <List
      shareable
      alwaysSelected
      selectable="multi"
      onSelect={props.selectItems}
      items={people}
      removePrefix="@"
      sortBy={useCallback(x => x.title.toLowerCase(), [])}
      groupByLetter
      groupMinimum={12}
      placeholder={
        <Section padding space titleScale={0.75} flex={1} title="Directory empty">
          <Paragraph>
            To see your contacts, add an app that syncs people from your{' '}
            <LocationLink url="/apps/apps">workspace settings</LocationLink>.
          </Paragraph>
          <Center>
            <Button onClick={useLocationLink('/')} size={1.2}>
              Search all
            </Button>
          </Center>
        </Section>
      }
    />
  )
}

function PeopleAppMain(props: AppViewProps) {
  if (!props.id) {
    return (
      <Center>
        <SubTitle>No person selected</SubTitle>
      </Center>
    )
  }
  return <PersonMedia id={+props.id} />
}
