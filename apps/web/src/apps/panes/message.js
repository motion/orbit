import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from './pane'
console.log('pane is', Pane)

@view
export default class Message {
  render({ data }) {
    return (
      <Pane.Card title={'not implemented yet'} icon={data.icon}>
        <container $$centered $$row>
          <UI.Icon if={data.icon} name={data.icon} />
          <UI.Title>
            {data.message}
          </UI.Title>
        </container>
      </Pane.Card>
    )
  }
}
