import { view } from '@mcro/black'
import Children from './children'

export Bar from './bar'
export Results from './results'

@view
export default class Explorer {
  render() {
    return (
      <explorer>
        <Children />
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
