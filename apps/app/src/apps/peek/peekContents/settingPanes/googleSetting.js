import * as React from 'react'
import { view } from '@mcro/black'
import { GoogleMail } from './googlePanes/googleMail'

@view
export class GoogleSetting extends React.Component {
  render() {
    return <GoogleMail {...this.props} />
  }
}
