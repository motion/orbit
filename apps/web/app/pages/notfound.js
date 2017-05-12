import { view } from '~/helpers'
import { Document } from '@jot/models'

@view({
  store: class NotFoundStore {
    test = Document.get('7ig1x3xc9a:1494344455919')
  },
})
export default class NotFound {
  render({ store }) {
    console.log('test is', store.test)
    return <div>404</div>
  }
}
