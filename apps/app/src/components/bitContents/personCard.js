import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'

@view
export class PersonCard extends React.Component {
  render({ children, bit }) {
    return children({
      // preview: bit.data.profile.email,
      title: bit.name,
      icon: 'users_square',
      iconProps: {
        color: '#ccc',
      },
      preview: (
        <test>
          <img $avatar src={bit.data.profile.image_512} />
          <subtitles>
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
      top: 0,
      right: 0,
      transform: {
        scale: 2,
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
