import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitIcon } from '../../../views/OrbitIcon'
import { BitRepository } from '../../../repositories'
import { SubTitle, RoundButton } from '../../../views'
import { OrbitCardMasonry } from '../../../views/OrbitCardMasonry'
import { PeekPaneProps } from '../PeekPaneProps'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'
import { Carousel } from '../../../components/Carousel'
import { App } from '@mcro/stores'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { Person } from '@mcro/models'

const StrongSubTitle = props => (
  <SubTitle fontWeight={500} fontSize={16} alpha={0.8} {...props} />
)

const mapW = 700
const mapH = 200

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
  background: 'linear-gradient(transparent, #fbfbfb)',
})

// FadeMap.theme = ({ theme }) => ({
//   background: `linear-gradient(transparent, ${theme.base.background})`,
// })

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
  top: 50,
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
  margin: [-20, 0, 0, -45],
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
  left: 90,
  flexFlow: 'row',
})

const IntegrationButton = ({ href, children, ...props }) => (
  <RoundButton
    onClick={() => App.actions.open(href)}
    icon={<OrbitIcon preventAdjust size={14} {...props} />}
  >
    {children}
  </RoundButton>
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
    const { store, integrationSettingsStore, model, children } = this.props
    const person = model as Person
    const { settings } = integrationSettingsStore
    if (!settings) {
      return children({})
    }
    // @ts-ignore
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
              <Email href={`mailto:${person.data.email}`}>
                {person.data.email}
              </Email>
              <br />
              <Links>
                <IntegrationButton
                  icon="slack"
                  href={`slack://user?team=${
                    1 /* setting.values.oauth.info.team.id */
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
              <Section>
                <StrongSubTitle>Interested in</StrongSubTitle>
                <Carousel
                  items={[
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
                  ]}
                />
              </Section>

              <Section>
                <StrongSubTitle>Recently</StrongSubTitle>
                <OrbitCardMasonry items={store.recentBits} />
              </Section>
            </ContentInner>
          </Content>
        </Frame>
      ),
    })
  }
}
