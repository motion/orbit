import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { sortBy, reverse } from 'lodash'
import { Thing } from '~/app'
import Things from '../views/things'
import * as Collapse from '../views/collapse'

@view({
  store: class DriveStore {},
})
export default class Drive {
  render({ store }) {
    return (
      <container>
        <UI.Title>hi</UI.Title>
      </container>
    )
  }

  static style = {
    add: {
      marginLeft: 15,
      marginTop: 15,
    },
  }
}
