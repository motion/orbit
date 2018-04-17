import * as React from 'react'
import { view } from '@mcro/black'
import PeekFrame from '../peekFrame'
import OrbitIcon from '~/apps/orbit/orbitIcon'
import * as UI from '@mcro/ui'
import Results from '~/apps/results/results'

const mapW = 700
const mapH = 300

@view
export class Person {
  render({ person, appStore }) {
    if (!person || !person.data.profile) {
      log(`no person`)
      return <PeekFrame />
    }
    console.log('person', person)
    const setting = appStore.settings.slack
    return (
      <PeekFrame>
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
              <icons>
                <a
                  $intButton
                  href={`slack://user?team=${
                    setting.values.oauth.info.team.id
                  }&id=${person.data.id}`}
                >
                  <OrbitIcon $intIcon icon="slack" size={18} />
                  Slack
                </a>
              </icons>
            </info>
          </cardContent>
          <map>
            <fadeMap />
            <img
              $mapImg
              src={`https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAsT_1IWdFZ-aV68sSYLwqwCdP_W0jCknA&center=${
                person.data.tz
              }&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=${mapW}x${mapH}`}
            />
          </map>
          <content>
            <card>
              <UI.Title fontWeight={800} css={{ margin: [0, 0, 5] }}>
                Spends time in...
              </UI.Title>
              <row $$row>
                <item>
                  <itemTitle>#general</itemTitle>
                </item>
                <item>
                  <itemTitle>#status</itemTitle>
                </item>
                <item>
                  <itemTitle>#showoff</itemTitle>
                </item>
              </row>
            </card>

            <card>
              <UI.Title fontWeight={800} css={{ margin: [0, 0, 5] }}>
                Recently...
              </UI.Title>
              <Results />
            </card>
          </content>
        </frame>
      </PeekFrame>
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
      padding: [10, 30],
      overflowY: 'scroll',
      flex: 1,
      position: 'relative',
      zIndex: 100,
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
      background: 'linear-gradient(transparent, #fff)',
      zIndex: 2,
    },
    info: {
      display: 'block',
      position: 'absolute',
      top: 60,
      left: 120,
    },
    name: {
      display: 'inline-block',
      fontSize: 30,
      fontWeight: 800,
      padding: [10, 12],
      background: '#fff',
    },
    email: {
      display: 'inline-block',
      background: '#000',
      color: '#fff',
      fontWeight: 600,
      padding: [4, 8],
      marginLeft: 10,
    },
    avatar: {
      margin: [-20, 0, 20, -70],
      width: 256,
      height: 256,
      borderRadius: 1000,
    },
    card: {
      marginBottom: 25,
    },
    icons: {
      position: 'relative',
      top: 35,
      left: 90,
      flexFlow: 'row',
    },
    intButton: {
      padding: 5,
      flexFlow: 'row',
      fontSize: 14,
      fontWeight: 600,
      background: '#fff',
    },
    intIcon: {
      marginRight: 8,
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
