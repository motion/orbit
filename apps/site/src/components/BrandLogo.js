import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'

@view
export class BrandLogo extends React.Component {
  render({ white }) {
    return (
      <brandMark {...this.props}>
        <Logo size={0.29} white={white} />
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      alignItems: 'center',
      textAlign: 'center',
      marginTop: -5,
      marginLeft: -8,
      // marginLeft: -20,
    },
  }
}
