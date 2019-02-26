import { loadMany, loadOne, observeMany } from '@mcro/bridge'
import { gloss } from '@mcro/gloss'
import { AppProps, ListItem, useStores } from '@mcro/kit'
import {
  Bit,
  BitModel,
  CosalTopicsModel,
  PersonBitModel,
  SlackBitData,
  SlackPersonData,
} from '@mcro/models'
import { HorizontalSpace, RoundButton, Row, SubTitle } from '@mcro/ui'
import { ensure, react, useStore } from '@mcro/use-store'
import * as React from 'react'
// import { AppActions } from '../../actions/appActions/AppActions'

const getBitTexts = (bits: Bit[]) => {
  return bits
    .map(x => {
      if (x.sourceType === 'slack') {
        const data = x.data as SlackBitData
        return data.messages.map(m => m.text).join(' ')
      }
      return `${x.title} ${x.body}`
    })
    .join(' ')
}

class PeopleAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appConfig
  }

  person = react(
    () => this.appConfig,
    appConfig => {
      ensure('appConfig', !!appConfig)
      return loadOne(PersonBitModel, {
        args: {
          where: { id: +appConfig.id },
          relations: ['people'],
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
              personBit: {
                email: person.email,
              },
            },
          },
          order: {
            bitUpdatedAt: 'DESC',
          },
          take: 40,
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
      return await loadMany(CosalTopicsModel, {
        args: {
          query,
          count: 10,
        },
      })
    },
    {
      defaultValue: [],
    },
  )
}

const PersonHeader = gloss()

export function PeopleAppMain(props: AppProps) {
  const { queryStore, themeStore } = useStores()
  const { person, topics, recentBits } = useStore(PeopleAppStore, props)

  console.log('hihi')

  if (!person) {
    return <div>No one selected 2</div>
  }
  return (
    <Frame>
      <PersonHeader draggable /*  onDragStart={appPageStore ? appPageStore.onDragStart : null} */>
        <CardContent>
          <Avatar src={person.photo} />
          <Info>
            <Name>{person.name}</Name>
            <br />
            <Email href={`mailto:${person.email}`}>{person.email}</Email>
            <br />
            <Links>
              {/* <SourceButton
            icon="slack"
            href={`slack://user?team=${setting.values.oauth.info.team.id}&id=${person.sourceId}`}
          >
            Slack
          </SourceButton> */}
              <SourceButton
                icon="zoom"
                onClick={() => queryStore.setQuery(`${person.name} documents`)}
              >
                Documents
              </SourceButton>
              <HorizontalSpace />
              <SourceButton icon="zoom" onClick={() => queryStore.setQuery(`${person.name} tasks`)}>
                Tasks
              </SourceButton>
            </Links>
          </Info>
        </CardContent>
        {!themeStore.isDark && (
          <Map>
            <FadeMap />
            <FadeMapRight />
            <MapImg
              src={`https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAsT_1IWdFZ-aV68sSYLwqwCdP_W0jCknA&center=${
                // TODO @umed person-bit refactor to bit should then come back here and fix this
                // @ts-ignore
                ((person.data as SlackPersonData) || {}).tz
              }&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=${mapW}x${mapH}`}
            />
          </Map>
        )}
      </PersonHeader>
      <Content>
        <ContentInner>
          <Section>
            <StrongSubTitle>Topics</StrongSubTitle>
            <Row flexFlow="row" flexWrap="wrap" padding={[5, 0, 0]}>
              {topics.map((item, index) => (
                <RoundButton size={1.2} margin={[0, 6, 6, 0]} key={index}>
                  {item}
                </RoundButton>
              ))}
            </Row>
          </Section>

          <Section>
            <StrongSubTitle>Recently</StrongSubTitle>

            <Unpad>
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
            </Unpad>
          </Section>
        </ContentInner>
      </Content>
    </Frame>
  )
}

const mapW = 700
const mapH = 200

const StrongSubTitle = props => <SubTitle fontWeight={200} fontSize={18} alpha={0.8} {...props} />

const Frame = gloss({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  overflowY: 'auto',
  position: 'relative',
})

const Content = gloss({
  padding: [10, 0],
  flex: 1,
  position: 'relative',
  zIndex: 100,
})

const Unpad = gloss({
  margin: [0, -15],
})

const ContentInner = gloss({
  padding: [0, 15],
})

const CardContent = gloss({
  position: 'relative',
  zIndex: 3,
  height: 180,
})

const Map = gloss({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  overflow: 'hidden',
  height: mapH,
  zIndex: 0,
})

const MapImg = gloss('img', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  opacity: 0.6,
})

const FadeMap = gloss({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 200,
  zIndex: 2,
  background: 'linear-gradient(transparent, #fbfbfb)',
})

const FadeMapRight = gloss({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}).theme((_, theme) => ({
  background: `linear-gradient(to right, transparent, ${theme.background})`,
}))

const Info = gloss({
  display: 'block',
  position: 'absolute',
  top: 30,
  left: 170,
})

const Name = gloss({
  display: 'inline-block',
  fontSize: 30,
  fontWeight: 800,
  padding: [10, 12],
  background: [255, 255, 255],
})

const Email = gloss('a', {
  display: 'inline-block',
  background: [0, 0, 0],
  color: '#fff',
  fontWeight: 600,
  padding: [4, 8],
  marginLeft: 10,
})

const Avatar = gloss('img', {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: [-30, 0, 0, -45],
  width: 200,
  height: 200,
  borderRadius: 1000,
})

const Section = gloss({
  marginBottom: 15,
})

const Links = gloss({
  position: 'relative',
  top: 25,
  left: 0,
  flexFlow: 'row',
})

const SourceButton = props => <RoundButton {...props} />
