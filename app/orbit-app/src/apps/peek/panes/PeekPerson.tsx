import { view } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { BitModel, PersonBit, SlackPersonData } from '@mcro/models'
import * as React from 'react'
import { AppsStore } from '../../AppsStore'
import { RoundButton, SubTitle } from '../../../views'
import { OrbitIcon } from '../../../views/OrbitIcon'
import { OrbitListItem } from '../../../views/OrbitListItem'
import { PeekPaneProps } from '../PeekPaneProps'
import { App } from '@mcro/stores'
import { Button, Row } from '@mcro/ui'
// import { getTopics } from '../../../loaders/search'

type Props = PeekPaneProps<PersonBit> & {
  appsStore: AppsStore
}

class PeekPersonStore {
  props: Props

  get person() {
    return this.props.model as PersonBit
  }

  recentBits = []
  interestedIn = []

  async didMount() {
    this.loadRecentBits()
    this.loadInterestedIn()
  }

  async loadInterestedIn() {
    // this.interestedIn = await getTopics({
    //   query: {
    //     query: '',
    //     take: 500,
    //     // peopleFilters: [this.person.name],
    //   },
    //   count: 15,
    // })
  }

  async loadRecentBits() {
    this.recentBits = await loadMany(BitModel, {
      args: {
        where: {
          people: {
            personBit: {
              email: this.person.email,
            },
          },
        },
        order: {
          bitUpdatedAt: 'DESC',
        },
        take: 15,
      },
    })
  }
}

const mapW = 700
const mapH = 200

const StrongSubTitle = props => (
  <SubTitle padding={[0, 10]} fontWeight={200} fontSize={18} alpha={0.8} {...props} />
)

const Frame = view({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  overflowY: 'auto',
  position: 'relative',
})

const Content = view({
  padding: [10, 0],
  flex: 1,
  position: 'relative',
  zIndex: 100,
})

const ContentInner = view({
  // padding: [0, 15],
})

const CardContent = view({
  position: 'relative',
  zIndex: 3,
  height: 180,
})

const Map = view({
  position: 'absolute',
  top: 0,
  left: 0,
  width: mapW,
  height: mapH,
  zIndex: 0,
})

const MapImg = view('img', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.6,
})

const FadeMap = view({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 200,
  zIndex: 2,
  background: 'linear-gradient(transparent, #fbfbfb)',
})

const FadeMapRight = view({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}).theme(({ theme }) => ({
  background: `linear-gradient(to right, transparent, ${theme.background})`,
}))

const Info = view({
  display: 'block',
  position: 'absolute',
  top: 30,
  left: 170,
})

const Name = view({
  display: 'inline-block',
  fontSize: 30,
  fontWeight: 800,
  padding: [10, 12],
  background: [255, 255, 255],
})

const Email = view('a', {
  display: 'inline-block',
  background: [0, 0, 0],
  color: '#fff',
  fontWeight: 600,
  padding: [4, 8],
  marginLeft: 10,
})

const Avatar = view('img', {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: [-30, 0, 0, -45],
  width: 200,
  height: 200,
  borderRadius: 1000,
})

const Section = view({
  marginBottom: 15,
})

const Links = view({
  position: 'relative',
  top: 25,
  left: 0,
  flexFlow: 'row',
})

const IntegrationButton = ({ children, icon, size = 14, ...props }) => (
  <RoundButton icon={<OrbitIcon icon={icon} preventAdjust size={size} />} {...props}>
    {children}
  </RoundButton>
)

@view.attach('appsStore', 'queryStore')
@view.attach({
  store: PeekPersonStore,
})
@view
export class PeekPerson extends React.Component<Props & { store: PeekPersonStore }> {
  render() {
    const { model, children, store } = this.props
    const person = model as PersonBit
    if (!person) {
      console.log('no person?', person)
      return children({})
    }
    return children({
      title: person.name,
      headerProps: {
        // make header not push down content
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
      content: (
        <Frame>
          <CardContent>
            <Avatar src={person.photo} />
            <Info>
              <Name>{person.name}</Name>
              <br />
              <Email href={`mailto:${person.email}`}>{person.email}</Email>
              <br />
              <Links>
                {/* <IntegrationButton
                  icon="slack"
                  href={`slack://user?team=${setting.values.oauth.info.team.id}&id=${person.integrationId}`}
                >
                  Slack
                </IntegrationButton> */}
                <IntegrationButton
                  icon="zoom"
                  size={12}
                  onClick={() => App.setState({ query: `${person.name} documents` })}
                >
                  Documents
                </IntegrationButton>
                <IntegrationButton
                  icon="zoom"
                  size={12}
                  onClick={() => App.setState({ query: `${person.name} tasks` })}
                >
                  Tasks
                </IntegrationButton>
              </Links>
            </Info>
          </CardContent>
          <Map>
            <FadeMap />
            <FadeMapRight />
            <MapImg
              src={`https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAsT_1IWdFZ-aV68sSYLwqwCdP_W0jCknA&center=${
                ((person.data as SlackPersonData) || {}).tz
              }&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=${mapW}x${mapH}`}
            />
          </Map>
          <Content>
            <ContentInner>
              <Section>
                <StrongSubTitle>Recent unique topics</StrongSubTitle>
                <Row flexFlow="row" flexWrap="wrap" padding={[10, 15, 0]}>
                  {store.interestedIn.map((item, index) => (
                    <Button sizeHeight={0.9} margin={[0, 6, 6]} sizeRadius={2} key={index}>
                      {item}
                    </Button>
                  ))}
                </Row>
              </Section>

              <Section>
                <StrongSubTitle>Recently</StrongSubTitle>
                {(store.recentBits || []).map(bit => {
                  return (
                    <OrbitListItem
                      key={bit.id}
                      model={bit}
                      margin={0}
                      padding={15}
                      isExpanded
                      theme={{
                        backgroundHover: 'transparent',
                      }}
                    >
                      {({ content }) => content}
                    </OrbitListItem>
                  )
                })}
              </Section>
            </ContentInner>
          </Content>
        </Frame>
      ),
    })
  }
}
