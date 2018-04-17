import { view } from '@mcro/black'
import GoogleMailSetting from './googleMail'

@view
export default class GoogleSetting {
  render() {
    return (
      <React.Fragment>
        <GoogleMailSetting {...this.props} />
      </React.Fragment>
    )
  }
}
