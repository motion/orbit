import { App, AppProps, Bit, createApp, LocationLink, useBit, useBits, useBitSearch, useLocationLink, useNLPTopics, useStores } from '@o/kit'
import { Avatar, Button, Center, Col, gloss, List, ListItem, Paragraph, RoundButton, Row, Section, Space, SubTitle, TitleRow } from '@o/ui'
import React, { useCallback } from 'react'

export default createApp({
  id: 'people',
  name: 'People',
  icon: 'person',
  itemType: 'person',
  app: props => (
    <App index={<PeopleAppIndex />}>
      <PeopleAppMain {...props} />
    </App>
  ),
  viewConfig: {
    acceptsSearch: true,
  },
})

function PeopleAppIndex() {
  const people = useBitSearch({
    type: 'person',
    excludeData: true,
    where: { title: { $not: { $equal: '' } } },
  })
  console.log('people222', people)
  return (
    <List
      shareable
      selectable="multi"
      items={people}
      removePrefix="@"
      sortBy={useCallback(x => x.title.toLowerCase(), [])}
      groupByLetter
      groupMinimum={12}
      placeholder={
        <Section pad space flex={1} title="Directory empty">
          <Paragraph>
            To see your contacts, add an app that syncs people from your{' '}
            <LocationLink url="/apps/apps">workspace settings</LocationLink>.
          </Paragraph>
          <Center>
            <Button {...useLocationLink('/')} size={1.2}>
              Search all
            </Button>
          </Center>
        </Section>
      }
    />
  )
}

export function PeopleAppMain(props: AppProps) {
  if (props.identifier === 'people') {
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
      take: 10,
    },
  )

  const query = getBitTexts(recentBits)
  const topics = useNLPTopics({
    query,
    count: 10,
  })

  if (!person) {
    return null
  }

  return (
    <Section
      space
      pad
      scrollable="y"
      titleElement={
        <TitleRow
          pad="xl"
          before={<Avatar src={person.photo} />}
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
      <StrongSubTitle>Topics</StrongSubTitle>
      <Row flexDirection="row" flexWrap="wrap" padding={[5, 0, 0]}>
        {topics.map((item, index) => (
          <RoundButton size={1.2} margin={[0, 6, 6, 0]} key={index}>
            {item}
          </RoundButton>
        ))}
      </Row>

      <Col space>
        <StrongSubTitle>Recently</StrongSubTitle>

        {recentBits.map(bit => {
          return (
            <ListItem
              oneLine={false}
              key={bit.id}
              item={bit}
              margin={0}
              padding={[15, 20]}
              onDoubleClick={() => {
                console.warn('!TODO fix')
                // AppActions.open(bit)
              }}
            />
          )
        })}
      </Col>
    </Section>
  )
}

const StrongSubTitle = props => <SubTitle fontWeight={200} fontSize={18} alpha={0.8} {...props} />

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
        return data.messages.map(m => m.text).join(' ')
      }
      return `${x.title} ${x.body}`
    })
    .join(' ')
}
