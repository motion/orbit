import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class Avatar extends React.Component {
  render() {
    return <img {...this.props} />
  }
  static style = {
    img: {
      width: 40,
      height: 40,
      borderRadius: 100,
      marginBottom: 5,
      border: [3, [255, 255, 255, 0.1]],
      '&:hover': {
        borderColor: [255, 255, 255, 0.4],
      },
    },
  }
}
