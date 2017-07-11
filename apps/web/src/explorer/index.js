import { view } from '@mcro/black'

export Bar from './bar'

@view
export default class Explorer {
  render() {
    return <explorer />
  }

  static style = {
    explorer: {
      // maxHeight: '50%',
      // position: 'relative',
    },
  }
}
