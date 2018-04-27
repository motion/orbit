import { view } from '@mcro/black'
// import * as React from 'react'
// import * as UI from '@mcro/ui'

@view
export default class BitSlackConversation {
  render({ children, result }) {
    return children({
      title: result.name,
      permalink: result.data.profile.email,
      location: result.data.tz,
      preview: (
        <test>
          <img $avatar src={result.data.profile.image_512} />
        </test>
      ),
    })
  }

  static style = {
    avatar: {
      borderRadius: 100,
      width: 100,
      height: 100,
    },
  }
}
