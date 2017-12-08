import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps'

const MyMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: -34.397, lng: 150.644 }}
      {...props}
    />
  ))
)

export default () => (
  <View.Page>
    <View.Header />
    <View.Content>
      <UI.Title size={2} fontWeight={700}>
        Delivery map
      </UI.Title>
      <br />
      <MyMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3QXSxVV4Dkdt9oiTFKnwMX-5-c0gzSUc&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />

      <br />

      <View.Section>
        <View.Col>
          <View.SubTitle>Late Deliveries</View.SubTitle>
          <View.SubText>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi velit
            illum quas rem suscipit enim, facere soluta, libero laborum maiores
            molestiae natus repellat modi, pariatur fuga ipsam quo a corrupti!
          </View.SubText>
        </View.Col>
      </View.Section>
    </View.Content>
  </View.Page>
)
