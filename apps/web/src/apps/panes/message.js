import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneCard from './views/card'

@view
export default class Message {
  render({ data }) {
    return (
      <PaneCard title={'not implemented yet'} icon={data.icon}>
        <container $$centered $$row>
          <UI.Icon if={data.icon} name={data.icon} />
          <UI.Title>
            {data.message}
          </UI.Title>
        </container>
      </PaneCard>
    )
  }
}
