import { view } from '@mcro/black'
import Logo from '~/views/logo'

@view
export class BrandLogo {
  render() {
    return (
      <brandMark {...this.props}>
        <Logo size={0.2} color="#090909" />
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
