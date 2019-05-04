import {
  AppProps,
  Bit,
  BitModel,
  ensure,
  loadOne,
  NLP,
  observeMany,
  react,
  useStore,
  useStores,
} from '@o/kit'
import {
  Col,
  gloss,
  ListItem,
  RoundButton,
  Row,
  Space,
  SubTitle,
  TitleRow,
  Avatar,
  Section,
} from '@o/ui'
import * as React from 'react'

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

class PeopleAppStore {
  props: AppProps

  person = react(
    () => this.props.id,
    id => {
      return loadOne(BitModel, {
        args: {
          where: {
            type: 'person',
            id: +id,
          },
          // relations: ['people'], // todo(nate): check why do we need it here
        },
      })
    },
  )

  recentBits = react(
    () => this.person,
    person => {
      ensure('person', !!person)
      return observeMany(BitModel, {
        args: {
          where: {
            people: {
              email: person.email,
            },
            // todo(nate): below has been changed please check it
            // people: {
            //   personBit: {
            //     email: person.email,
            //   },
            // },
          },
          order: {
            bitUpdatedAt: 'DESC',
          },
          take: 10,
        },
      })
    },
    {
      defaultValue: [],
    },
  )

  topics = react(
    () => this.recentBits,
    async bits => {
      ensure('bits', !!bits.length)
      const query = getBitTexts(bits)
      return await NLP.getTopics({
        query,
        count: 10,
      })
    },
    {
      defaultValue: [],
    },
  )
}

const PersonHeader = gloss()

export function PeopleAppMain(props: AppProps) {
  const { queryStore } = useStores()
  const { person, topics, recentBits } = useStore(PeopleAppStore, props)

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

const CardContent = gloss({
  position: 'relative',
  zIndex: 3,
  height: 180,
})

const Info = gloss({
  display: 'block',
  position: 'absolute',
  top: 30,
  left: 170,
})

const Email = gloss('a', {
  display: 'inline-block',
  background: [0, 0, 0],
  color: '#fff',
  fontWeight: 600,
  padding: [4, 8],
  marginLeft: 10,
})

const SourceButton = props => <RoundButton {...props} />
