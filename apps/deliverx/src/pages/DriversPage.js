import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import { view } from '@mcro/black'

const drivers = [
  {
    name: 'Dana Beck',
    bio:
      'Dana is a driver in San Francisco who prefers to driver primarily on the weekends because she is currently enrolled in USCF studying psychology.',
    deliveries: 57,
    time: 14,
    picture:
      'https://pbs.twimg.com/profile_images/438744776134107136/SrzRIJgh_400x400.jpeg',
  },

  {
    name: 'Scott Parsons',
    bio:
      'Scott drives works full time starting early in the morning to support his wife and daughter in San Jose. For fun he likes to watch Basketball and tries to bake the perfect bread to little success so far. He has hope.',
    deliveries: 430,
    time: 7,
    picture:
      'https://pbs.twimg.com/profile_images/833845250410020864/LCMXmUlc_400x400.jpg',
  },

  {
    name: 'Jiasha Wang',
    bio:
      'Jiasha came from west China after her family moved three years ago. He drives a 2014 Prius and prefers to drive in San Francisco, but will travel to other parts of the Bay.',
    deliveries: 1315,
    time: 21,
    picture:
      'https://pbs.twimg.com/profile_images/938587504193576966/h4FrBivD_400x400.jpg',
  },

  {
    name: 'Jonathan Tsung',
    bio:
      'Jonathan grew up in LA but moved to the Bay a few months ago. On the side, he’s learning web development on Khan Academy. He drives to afford rent in this crazy city.',
    deliveries: 305,
    time: 2,
    picture:
      'https://pbs.twimg.com/profile_images/839610944233828354/-IUasRa2_400x400.jpg',
  },

  {
    name: 'Archit Khatri',
    bio:
      'Archit is one of DeliverX’s youngest drivers, joining right out of high school. In India he studied communication and marketing.',
    deliveries: 411,
    time: 4,
    picture:
      'https://pbs.twimg.com/profile_images/921882410136023040/wriyuiI8_400x400.jpg',
  },

  {
    name: 'Joey Stanford',
    bio:
      'Joey recently joined DriverX after working as a sales representative at a tech startup. He very much enjoys not having to making ten calls per hour. His favorite thing to order from DeliverX is the fresh hummus from Richmond.',
    deliveries: 90,
    time: 2,
    picture:
      'https://pbs.twimg.com/profile_images/798544465367416832/KW8GWI9m_400x400.jpg',
  },

  {
    name: 'Henry Maier',
    bio:
      'Henry recently finished high school in Michigan and is taking a gap year in SF before studying computer science in LA next year. He only works on the weekends.',
    deliveries: 16,
    time: 2,
    picture:
      'https://pbs.twimg.com/profile_images/921433606471294976/7Rz1ajE4_400x400.jpg',
  },
]

/*
Dav Yaginuma
Victor Gibbon
Kevin Guillen
Sarah Siwak
Judith Roth
Jana Zur
Annie Huang
*/

@view
export default class Driver {
  render() {
    return (
      <View.Page $page>
        <View.Header />
        <View.Content>
          <UI.Title size={2} fontWeight={700}>
            Drivers
          </UI.Title>
          <br />

          <View.Section>
            <drivers>
              {drivers.map(driver => (
                <driver $$row>
                  <img width={200} height={200} src={driver.picture} />
                  <profile>
                    <UI.Title size={1.4}>{driver.name}</UI.Title>
                    <bio>{driver.bio}</bio>
                    <stats $$row>
                      <left $$row>
                        <b>{driver.deliveries}</b> deliveries over{' '}
                        <b>{driver.time}</b> months
                      </left>
                      <right $$row>
                        last delivery{' '}
                        <b>{Math.floor(2 + Math.random() * 30)}</b> hours ago
                      </right>
                    </stats>
                  </profile>
                </driver>
              ))}
            </drivers>
          </View.Section>
        </View.Content>
      </View.Page>
    )
  }

  static style = {
    img: {},
    page: {
      overflow: 'scroll',
      height: '100%',
    },
    driver: {
      margin: [15, 0],
      padding: 15,
      border: '1px solid rgba(0,0,0,0.2)',
      background: 'rgba(0,0,0,0.02)',
      boxShadow: '1px 1px 1px rgba(0,0,0,0.05)',
    },
    profile: {
      width: 650,
      marginLeft: 20,
      justifyContent: 'space-between',
    },
    stats: {
      justifyContent: 'space-between',
    },
    b: {
      marginLeft: 3,
      marginRight: 3,
    },
    bio: {
      lineHeight: 1.6,
      fontSize: 15,
    },
    picture: {
      width: 150,
      height: 150,
      background: `rgba(0,0,0,0.2)`,
    },
  }
}
