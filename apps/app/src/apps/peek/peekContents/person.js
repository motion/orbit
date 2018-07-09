import * as React from 'react'
import { view } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { OrbitIcon } from '../../../apps/orbit/orbitIcon'
import * as UI from '@mcro/ui'
import { Carousel } from '../../../components/Carousel'
import { Bit } from '@mcro/models'
import { SubTitle } from '../../../views'

const StrongSubTitle = props => (
  <SubTitle fontWeight={500} fontSize={16} {...props} />
)

const mapW = 700
const mapH = 300

class PersonPeek {
  relatedConversations = modelQueryReaction(
    () =>
      Bit.find({
        relations: ['people'],
        where: { integration: 'slack', type: 'conversation' },
        take: 3,
      }),
    { defaultValue: [] },
  )
}

@view.attach({
  store: PersonPeek,
})
@view
export class Person extends React.Component {
  render({ store, person, appStore }) {
    if (!appStore.settings) {
      return null
    }
    const setting = appStore.settings.slack
    if (!setting || !person || !person.data || !person.data.profile) {
      console.log('no person', person)
      return null
    }

    return (
      <frame>
        <cardContent>
          <img $avatar src={person.data.profile.image_512} />
          <info>
            <name>{person.name}</name>
            <br />
            <a $email href={`mailto:${person.data.profile.email}`}>
              {person.data.profile.email}
            </a>
            <br />
            <links>
              <a
                $intButton
                href={`slack://user?team=${
                  setting.values.oauth.info.team.id
                }&id=${person.data.id}`}
              >
                <OrbitIcon preventAdjust $intIcon icon="slack" size={14} />
                Slack
              </a>
              <a $intButton>
                <OrbitIcon
                  preventAdjust
                  $intIcon
                  icon="zoom"
                  size={12}
                  color="#777"
                />
                Documents
              </a>
              <a $intButton>
                <OrbitIcon
                  preventAdjust
                  $intIcon
                  icon="zoom"
                  size={12}
                  color="#777"
                />
                Tasks
              </a>
            </links>
          </info>
        </cardContent>
        <map>
          <fadeMap />
          <fadeMapRight />
          <img
            $mapImg
            src={`https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAsT_1IWdFZ-aV68sSYLwqwCdP_W0jCknA&center=${
              person.data.tz
            }&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=${mapW}x${mapH}`}
          />
        </map>
        <content>
          <contentInner>
            <card>
              <StrongSubTitle>Where</StrongSubTitle>
              <UI.ListRow
                itemProps={{
                  size: 1.05,
                  alpha: 0.9,
                  background: 'transparent',
                  borderRadius: 5,
                  margin: [0, 10, 0, -5],
                }}
              >
                <UI.Button>#general</UI.Button>
                <UI.Button>#status</UI.Button>
                <UI.Button icon="github">motion/orbit</UI.Button>
                <UI.Button>#showoff</UI.Button>
              </UI.ListRow>
            </card>

            <card>
              <StrongSubTitle>Topics</StrongSubTitle>
              <UI.ListRow
                itemProps={{
                  size: 1.05,
                  alpha: 0.9,
                  background: 'transparent',
                  borderRadius: 5,
                  margin: [0, 10, 0, -5],
                }}
              >
                <UI.Button icon="zoom">UI Kit</UI.Button>
                <UI.Button icon="zoom">size prop</UI.Button>
                <UI.Button icon="zoom">async migration</UI.Button>
                <UI.Button icon="zoom">freelance</UI.Button>
              </UI.ListRow>
            </card>

            <card>
              <StrongSubTitle>Conversations</StrongSubTitle>
              <Carousel items={store.relatedConversations} />
            </card>
          </contentInner>
        </content>
      </frame>
    )
  }

  static style = {
    frame: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    content: {
      padding: [10, 0],
      overflowY: 'scroll',
      flex: 1,
      position: 'relative',
      zIndex: 100,
    },
    contentInner: {
      padding: [0, 15],
    },
    cardContent: {
      position: 'relative',
      zIndex: 3,
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: mapW,
      height: mapH,
      zIndex: 0,
    },
    mapImg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.6,
    },
    fadeMap: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      background: 'linear-gradient(transparent, #f9f9f9)',
      zIndex: 2,
    },
    fadeMapRight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to right, transparent, #f9f9f9)',
      zIndex: 2,
    },
    info: {
      display: 'block',
      position: 'absolute',
      top: 60,
      left: 140,
    },
    name: {
      display: 'inline-block',
      fontSize: 30,
      fontWeight: 800,
      padding: [10, 12],
      background: [255, 255, 255],
    },
    email: {
      display: 'inline-block',
      background: [0, 0, 0],
      color: '#fff',
      fontWeight: 600,
      padding: [4, 8],
      marginLeft: 10,
    },
    avatar: {
      margin: [-40, 0, 15, -65],
      width: 256,
      height: 256,
      borderRadius: 1000,
    },
    card: {
      marginBottom: 20,
    },
    links: {
      position: 'relative',
      top: 25,
      left: 90,
      flexFlow: 'row',
    },
    intButton: {
      padding: [6, 10],
      marginRight: 7,
      borderRadius: 10,
      flexFlow: 'row',
      fontSize: 13,
      fontWeight: 500,
      background: 'linear-gradient(#fff, #f6f6f6 50%)',
      boxShadow: 'inset 0 0 1px #ccc, inset 0 1px #fff',
      border: [1, '#fff'],
      cursor: 'normal',
      '&:hover': {
        background: 'linear-gradient(#fff, #f9f9f9 50%)',
      },
    },
    intIcon: {
      marginRight: 7,
    },
    row: {
      margin: [0, -8],
    },
    item: {
      userSelect: 'none',
      cursor: 'default',
      color: '#3E88E0',
      fontWeight: 600,
      fontSize: 14,
      padding: [7, 10],
      margin: [4, 2, 0, 0],
      borderRadius: 100,
      '&:hover': {
        background: [0, 0, 0, 0.025],
      },
      '&:hover > .itemTitle': {
        borderBottom: [2, [44, 64, 87, 0.1]],
      },
    },
    itemTitle: {
      lineHeight: '1rem',
      display: 'inline-block',
      // padding: [2, 0, 2],
      borderBottom: [2, 'transparent'],
    },
  }
}
