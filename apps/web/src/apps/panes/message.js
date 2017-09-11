import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from './pane'

@view
export default class Message {
  render({ paneStore: { data } }) {
    return (
      <Pane.Card icon={data.icon}>
        <UI.Theme name="light">
          <container $$centered $$row>
            <UI.Icon if={data.icon} name={data.icon} />
            <UI.Title>{data.message}</UI.Title>
          </container>
        </UI.Theme>
      </Pane.Card>
    )
  }
}
