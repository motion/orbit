import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'

@view
export class PersonCard extends React.Component {
  render({ children, bit }) {
    if (!bit) {
      return null
    }
    return children({
      // preview: bit.data.profile.email,
      title: bit.name
        .replace('javivelasco', 'Nick Bovee')
        .replace('adhsu', 'Andrew Wang'),
      icon: 'users_square',
      iconProps: {
        color: '#ccc',
      },
      preview: (
        <test>
          <img if={bit.data.profile} $avatar src={bit.data.profile.image_512} />
          <subtitles if={bit.data.profile}>
            <location>{bit.data.tz}</location>
            <a href={`mailto:${bit.data.profile.email}`}>
              {bit.data.profile.email}
            </a>
          </subtitles>
        </test>
      ),
    })
  }

  static style = {
    test: {
      flex: 1,
    },
    avatar: {
      borderRadius: 100,
      width: 70,
      height: 70,
      margin: [10, 0],
      position: 'absolute',
      top: -15,
      right: -15,
      transform: {
        scale: 1.4,
        y: -5,
        rotate: '40deg',
      },
    },
    subtitles: {
      fontSize: 13,
      opacity: 0.5,
    },
  }
}
