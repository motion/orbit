import { view } from '@mcro/black'
// import * as React from 'react'
import * as UI from '@mcro/ui'

@view
export default class BitSlackConversation {
  render({ children, result }) {
    return children({
      preview: (
        <test>
          <img $avatar src={result.data.profile.image_512} />
          <UI.Text fontWeight={800} color="#000">
            {result.name}
          </UI.Text>
          <subtitles>
            <location>{result.data.tz}</location>
            <a href={`mailto:${result.data.profile.email}`}>
              {result.data.profile.email}
            </a>
          </subtitles>
        </test>
      ),
    })
  }

  static style = {
    test: {
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatar: {
      borderRadius: 100,
      width: 70,
      height: 70,
      margin: [10, 0],
    },
    subtitles: {
      fontSize: 13,
      opacity: 0.5,
      alignItems: 'center',
    },
    a: {
      textAlign: 'center',
      alignSelf: 'center',
    },
  }
}
