import { AppNavigator, AppViewProps, Bit, createApp, LocationLink, NavigatorProps, openItem, useBit, useBits, useBitSearch, useLocationLink, useNLPTopics, useStores } from '@o/kit'
import { Avatar, Button, Center, gloss, List, ListItem, Paragraph, RoundButton, Row, Section, Space, SubSection, SubTitle, TitleRow } from '@o/ui'
import React, { useCallback } from 'react'

export default createApp({
  id: 'people',
  name: 'People',
  icon: 'person',
  iconColors: ['rgb(133, 20, 75)', 'rgb(123, 10, 65)'],
  itemType: 'person',
  app: () => <AppNavigator index={PeopleAppIndex} detail={PeopleAppMain} />,
})

export function PeopleAppIndex(props: NavigatorProps) {
  const people = useBitSearch({
    type: 'person',
    excludeData: true,
    where: { title: { $not: { $equal: '' } } },
  })
  return (
    <List
      shareable
      selectable="multi"
      onSelect={items => props.navigateTo('detail', { items })}
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

export function PeopleAppMain(props: AppViewProps & { items: AppBit[] }) {
  if (!props.id) {
    return (
      <Center>
        <SubTitle>No person selected</SubTitle>
      </Center>
    )
  }
  return <PersonMedia id={+props.id} />
}

function PersonMedia({ id }: { id: number }) {
  const { queryStore } = useStores()
  const [person] = useBit({
    where: {
      type: 'person',
      id,
    },
  })
  const [recentBits] = useBits(
    !!person && {
      where: {
        people: {
          email: person.email,
        },
      },
      order: {
        bitUpdatedAt: 'DESC',
      },
      take: 20,
    },
  )
  const query = getBitTexts(recentBits)
  const topics = useNLPTopics({
    query,
    count: 10,
  })

  if (!person || !topics || !recentBits) {
    return null
  }

  return (
    <Section
      space="xl"
      padding
      scrollable="y"
      titleElement={
        <TitleRow
          padding="xl"
          space="xl"
          before={!!person.photo && <Avatar src={person.photo} />}
          title={person.title}
          subTitle={<Email href={`mailto:${person.email}`}>{person.email}</Email>}
          below={
            <Row>
              <SourceButton
                icon="search"
                onClick={() => queryStore.setQuery(`${person.title} documents`)}
              >
                Documents
              </SourceButton>
              <Space />
              <SourceButton
                icon="search"
                onClick={() => queryStore.setQuery(`${person.title} tasks`)}
              >
                Tasks
              </SourceButton>
            </Row>
          }
        />
      }
    >
      <SubSection title="Topics">
        <Row flexDirection="row" flexWrap="wrap" space="sm">
          {topics.map((item, index) => (
            <RoundButton size={1.2} key={index}>
              {item}
            </RoundButton>
          ))}
        </Row>
      </SubSection>

      <SubSection title="Recently">
        {recentBits.map(bit => {
          return (
            <ListItem
              oneLine={false}
              key={bit.id}
              item={bit}
              margin={0}
              padding={[15, 20]}
              onDoubleClick={() => {
                openItem(bit)
              }}
            />
          )
        })}
      </SubSection>
    </Section>
  )
}

const Email = gloss('a', {
  display: 'inline-block',
  background: [0, 0, 0],
  color: '#fff',
  fontWeight: 600,
  padding: [4, 8],
  marginLeft: 10,
})

const SourceButton = props => <RoundButton {...props} />

const getBitTexts = (bits: Bit[]) => {
  return bits
    .map(x => {
      if (x.appIdentifier === 'slack') {
        const data = x.data as any // todo fix typing
        return (data.messages || []).map(m => m.text).join(' ')
      }
      return `${x.title} ${x.body}`
    })
    .join(' ')
}
