import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const SubTitle = props => <UI.Title size={1.75} {...props} />
const SubText = props => <UI.Text selectable {...props} />

@view
export default class RootPage extends React.Component {
  render() {
    return (
      <page>
        <header>
          <img src="/DeliverX.svg" />
        </header>
        <content>
          <section>
            <col>
              <UI.Title size={2}>For all X, we deliver.</UI.Title>
              <SubText size={1.5}>
                Want some delivery but no one will fill your order? Fill for X
                with DeliverX!
              </SubText>
            </col>
          </section>

          <section>
            <col $half>
              <SubTitle>Sub Section</SubTitle>
              <SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </SubText>
            </col>
            <col $half>
              <SubTitle>Sub Section</SubTitle>
              <SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </SubText>
            </col>
            <col $half>
              <SubTitle>Sub Section</SubTitle>
              <SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </SubText>
            </col>
            <col $half>
              <SubTitle>Sub Section</SubTitle>
              <SubText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti sunt animi, doloribus est...
              </SubText>
            </col>
          </section>
        </content>
      </page>
    )
  }

  static style = {
    page: {
      padding: 10,
    },
    header: {
      background: '#f2f2f2',
      padding: [0, 20],
      marginBottom: 10,
    },
    img: {
      margin: [-5, 0, -25, 0],
      width: 200,
    },
    content: {
      padding: 20,
      border: [1, [0, 0, 0, 0.1]],
    },
    section: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
    col: {
      padding: 20,
      flex: 1,
    },
    half: {
      minWidth: '50%',
    },
  }
}
