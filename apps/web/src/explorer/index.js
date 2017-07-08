import { view } from '@mcro/black'
import Bar from './bar'
import Results from './results'

@view
export default class Explorer {
  render() {
    return (
      <explorer $$flex>
        <Bar />
        <Results />
      </explorer>
    )
  }
}
