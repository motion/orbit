import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import { view } from '@mcro/black'
import { compose, withProps, lifecycle } from 'recompose'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from 'react-google-maps'

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD3QXSxVV4Dkdt9oiTFKnwMX-5-c0gzSUc&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService()

      DirectionsService.route(
        {
          origin: new google.maps.LatLng(41.85073, -87.65126),
          destination: new google.maps.LatLng(41.85258, -87.65141),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result,
            })
          } else {
            console.error(`error fetching directions ${result}`)
          }
        }
      )
    },
  })
)(props => (
  <GoogleMap
    defaultZoom={0.1}
    defaultCenter={new google.maps.LatLng(41.85073, -87.65126)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
))

@view
export default class MapView {
  render() {
    return (
      <View.Page>
        <View.Header />
        <View.Content>
          <UI.Title size={2} fontWeight={700}>
            Delivery map
          </UI.Title>
          <br />
          <MapWithADirectionsRenderer />

          <br />

          <View.Section>
            <View.Col>
              <View.SubTitle>Late Deliveries</View.SubTitle>
              <View.SubText>
                <late>
                  <UI.Title size={1.3} fontWeight={600}>
                    Archit Khatri
                  </UI.Title>
                  <UI.Text>
                    <b>14 minutes late</b>: Delivering to Nikita Obidin in
                    Chicago
                  </UI.Text>
                  <reports>
                    <UI.Title size={1.1} fontWeight={500}>
                      Reports from Driver
                    </UI.Title>
                    <UI.Text>No reports from driver</UI.Text>
                  </reports>
                </late>
              </View.SubText>
            </View.Col>
          </View.Section>
        </View.Content>
      </View.Page>
    )
  }

  static style = {
    late: {
      border: '1px solid rgba(0,0,0,0.7)',
      padding: 10,
      margin: 5,
    },
  }
}
