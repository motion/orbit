import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import { view } from '@mcro/black'
import { range, sample } from 'lodash'

@view
export default class Driver {
  render() {
    const deliveries = [
      { item: 'burgers', restaurant: 'Haight McDonalds' },
      { item: 'pizza', restaurant: "Tony's Pizzeria" },
      { item: 'indian food', restaurant: 'Mission Pakwan' },
    ]
    return (
      <View.Page>
        <View.Header />
        <View.Content>
          <page $$row>
            <profile>
              <img
                width={70}
                css={{ alignSelf: 'center' }}
                height={70}
                src="https://pbs.twimg.com/profile_images/921882410136023040/wriyuiI8_400x400.jpg"
              />
              <UI.Title
                css={{ alignSelf: 'center', marginTop: 10 }}
                size={1.2}
                fontWeight={500}
              >
                Archit H
              </UI.Title>
            </profile>

            <user>
              <top $$row>
                <UI.Button chromeless>Orders</UI.Button>
                <UI.Button chromeless>Map</UI.Button>
              </top>
              <status>
                <UI.Title size={1.2} $h2>
                  $312 on 14 Deliveries over 6 Months across 2 platforms
                </UI.Title>
              </status>
              <deliveries>
                {deliveries.map(delivery => (
                  <delivery $$row>
                    <UI.Text $price size={1.6}>
                      ${10 + Math.floor(Math.random() * 30)}
                    </UI.Text>
                    <item>
                      <desc $$row>
                        Ordered a {delivery.item} from
                        <b>{delivery.restaurant}</b>
                        <when>four days ago</when>
                      </desc>
                      <metaInfo>
                        on iPhone X 10.2 using DeliverX App version 4.02
                      </metaInfo>
                    </item>
                  </delivery>
                ))}
              </deliveries>
            </user>
          </page>
        </View.Content>
      </View.Page>
    )
  }

  static style = {
    profile: {
      flex: 1,
    },
    h2: {
      alignSelf: 'center',
    },
    user: {
      alignSelf: 'center',
      justifyContent: 'center',
      flex: 5,
      margin: [0, 20],
    },
    status: {
      margin: [10, 0],
    },
    metaInfo: {
      opacity: 0.8,
    },
    delivery: {
      borderTop: '1px solid rgba(0,0,0,.1)',
      padding: [10, 20],
      alignItems: 'center',
    },
    price: {
      marginRight: 10,
      alignItems: 'center',
    },
    when: {
      opacity: 0.7,
    },
    b: {
      marginLeft: 3,
      marginRight: 3,
    },
  }
}
