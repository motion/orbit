import { view } from '@mcro/black'
import { GoogleMail } from './googleMail'

@view
export default class GoogleSetting {
  render() {
    return <GoogleMail {...this.props} />
  }
}
