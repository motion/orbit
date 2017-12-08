import * as React from 'react'
import * as View from '~/views'
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps'

const MyMap = withScriptjs(
  withGoogleMap(props => <GoogleMap defaultZoom={8} {...props} />)
)

export default () => (
  <View.Page>
    <View.Header />
    <View.Content>
      <MyMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </View.Content>
  </View.Page>
)
