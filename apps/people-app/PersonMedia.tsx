import { AppViewProps, Bit, openItem, useBit, useBits, useNLPTopics, useStores } from '@o/kit'
import { Avatar, gloss, ListItem, RoundButton, Section, Space, Stack, SubSection, TitleRow } from '@o/ui'
import React from 'react'

export function PersonMedia({ id }: AppViewProps) {
  const { queryStore } = useStores()
  const [person] = useBit({
    where: {
      type: 'person',
      id: +id,
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
            <Stack direction="horizontal">
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
            </Stack>
          }
        />
      }
    >
      <SubSection title="Topics">
        <Stack direction="horizontal" flexDirection="row" flexWrap="wrap" space="sm">
          {topics.map((item, index) => (
            <RoundButton size={1.2} key={index}>
              {item}
            </RoundButton>
          ))}
        </Stack>
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
