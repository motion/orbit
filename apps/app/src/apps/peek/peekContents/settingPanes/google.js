import { view } from '@mcro/black'
import { GoogleMail } from './googleMail'

@view
export default class GoogleSetting {
  render() {
    return (
      <React.Fragment>
        <GoogleMail {...this.props} />
      </React.Fragment>
    )
  }
}
