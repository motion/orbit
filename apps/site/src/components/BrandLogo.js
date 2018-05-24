import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'

@view
export class BrandLogo extends React.Component {
  render({ white }) {
    return (
      <brandMark {...this.props}>
        <Logo size={0.2} white={white} />
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      alignItems: 'center',
      textAlign: 'center',
      // marginLeft: -20,
    },
  }
}
