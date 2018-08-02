import * as React from 'react'
import { view } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { OrbitIcon } from '../../../apps/orbit/OrbitIcon'
import * as UI from '@mcro/ui'
import { BitRepository } from '../../../repositories'
import { SubTitle } from '../../../views'
import { OrbitCardMasonry } from '../../orbit/OrbitCardMasonry'
import { PeekPaneProps } from '../PeekPaneProps'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'
import { Masonry } from '../../../views/Masonry'
import { OrbitCard } from '../../orbit/OrbitCard'

const StrongSubTitle = props => (
  <SubTitle fontWeight={500} fontSize={16} alpha={0.8} {...props} />
)

const mapW = 700
const mapH = 300

class PersonPeek {
  recentBits = modelQueryReaction(
    () =>
      BitRepository.find({
        relations: ['people'],
        take: 10,
      }),
    { defaultValue: [] },
  )
}

const Frame = view({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  overflowY: 'scroll',
  position: 'relative',
})

const Content = view({
  padding: [10, 0],
  flex: 1,
  position: 'relative',
  zIndex: 100,
})

const ContentInner = view({
  padding: [0, 15],
})

const CardContent = view({
  position: 'relative',
  zIndex: 3,
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
})

FadeMap.theme = ({ theme }) => ({
  background: `linear-gradient(transparent, ${theme.base.background})`,
})

const FadeMapRight = view({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
})

FadeMapRight.theme = ({ theme }) => ({
  background: `linear-gradient(to right, transparent, ${
    theme.base.background
  })`,
})

const Info = view({
  display: 'block',
  position: 'absolute',
  top: 60,
  left: 140,
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
  margin: [-40, 0, 10, -65],
  width: 256,
  height: 256,
  borderRadius: 1000,
})

const Card = view({
  marginBottom: 20,
})

const Links = view({
  position: 'relative',
  top: 25,
  left: 90,
  flexFlow: 'row',
})

const IntButton = view('a', {
  padding: [6, 10],
  marginRight: 7,
  borderRadius: 7,
  flexFlow: 'row',
  fontSize: 13,
  fontWeight: 500,
  background: 'linear-gradient(#fff, #f4f4f4 70%)',
  boxShadow: 'inset 0 0 1px #ccc, inset 0 1px #fff',
  border: [1, '#fff'],
  cursor: 'default',
  '&:hover': {
    background: 'linear-gradient(#fff, #f9f9f9 50%)',
  },
})

const IntegrationButton = ({ href, children, ...props }) => (
  <IntButton href={href}>
    <OrbitIcon preventAdjust margin={[0, 7, 0, 0]} size={14} {...props} />
    {children}
  </IntButton>
)

@view.attach('integrationSettingsStore')
@view.attach({
  store: PersonPeek,
})
@view
export class PeekPerson extends React.Component<
  PeekPaneProps & {
    store: PersonPeek
    integrationSettingsStore: IntegrationSettingsStore
  }
> {
  render() {
    const { store, integrationSettingsStore, person, children } = this.props
    const { settings } = integrationSettingsStore
    if (!settings) {
      return children({})
    }
    const setting = settings.slack
    if (!setting || !person || !person.data || !person.data.profile) {
      console.log('no person or person.data.profile?', person)
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
            <Avatar src={person.data.profile.image_512} />
            <Info>
              <Name>{person.name}</Name>
              <br />
              <Email href={`mailto:${person.data.profile.email}`}>
                {person.data.profile.email}
              </Email>
              <br />
              <Links>
                <IntegrationButton
                  icon="slack"
                  href={`slack://user?team=${
                    setting.values.oauth.info.team.id
                  }&id=${person.data.id}`}
                >
                  Slack
                </IntegrationButton>
                <IntegrationButton icon="zoom" size={12} href="">
                  Documents
                </IntegrationButton>
                <IntegrationButton icon="zoom" size={12} href="">
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
                person.data.tz
              }&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=${mapW}x${mapH}`}
            />
          </Map>
          <Content>
            <ContentInner>
              <Card>
                <StrongSubTitle>Interested in</StrongSubTitle>
                <UI.Theme name="grey">
                  <Masonry>
                    {[
                      {
                        title: '#general',
                        icon: 'slack',
                        subtitle: '20 people',
                      },
                      {
                        title: '#status',
                        icon: 'slack',
                        subtitle: '29 people',
                      },
                      {
                        title: 'motion/orbit',
                        icon: 'github',
                        subtitle: '20 people',
                      },
                      {
                        title: '#showoff',
                        icon: 'slack',
                        subtitle: '78 people',
                      },
                    ].map((place, index) => (
                      <OrbitCard key={index} {...place} />
                    ))}
                  </Masonry>
                </UI.Theme>
              </Card>

              <Card>
                <StrongSubTitle>Recently</StrongSubTitle>
                <OrbitCardMasonry items={store.recentBits} />
              </Card>
            </ContentInner>
          </Content>
        </Frame>
      ),
    })
  }
}
