import { view } from '@mcro/black'
import Children from './children'

export Bar from './bar'

@view
export default class Explorer {
  render() {
    return (
      <explorer>
        <Children if={false} />
      </explorer>
    )
  }

  static style = {
    explorer: {
      // maxHeight: '50%',
      // position: 'relative',
    },
  }
}
