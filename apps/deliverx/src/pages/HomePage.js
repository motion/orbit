import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as View from '~/views'

@view
export default class HomePage extends React.Component {
  render() {
    return (
      <View.Page>
        <Header />
        <View.Content>
          <View.Section>
            <View.Col>
              <UI.Title size={2}>For all X, we deliver.</UI.Title>
              <View.SubText size={1.5}>
                Want some delivery but no one will fill your order? Fill for X
                with DeliverX!
              </View.SubText>
            </View.Col>
          </View.Section>

          <View.Section>
            <View.Col half>
              <View.SubTitle>Sub Section</View.SubTitle>
              <View.SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </View.SubText>
            </View.Col>
            <View.Col half>
              <View.SubTitle>Sub Section</View.SubTitle>
              <View.SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </View.SubText>
            </View.Col>
            <View.Col half>
              <View.SubTitle>Sub Section</View.SubTitle>
              <View.SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </View.SubText>
            </View.Col>
            <View.Col half>
              <View.SubTitle>Sub Section</View.SubTitle>
              <View.SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </View.SubText>
            </View.Col>
          </View.Section>
        </View.Content>
      </View.Page>
    )
  }
}
