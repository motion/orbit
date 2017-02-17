import { view } from 'my-decorators'

@view
export default class NotFound {
  render() {
    return <div>404</div>
  }
}
