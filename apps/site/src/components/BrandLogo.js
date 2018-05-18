import { view } from '@mcro/black'
import * as Constants from '~/constants'
import Logo from '~/views/logo'

@view
export class BrandLogo {
  render() {
    return (
      <brandMark {...this.props}>
        <Logo size={0.21} color="#090909" iconColor={Constants.brandColor} />
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
