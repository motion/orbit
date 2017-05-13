import { view } from '~/helpers'
import { Document } from '@jot/models'
import App from '@jot/models'
import Place from './place'

@view
export default class HomePage {
  render() {
    return <Place slug={(App.loggedIn && App.user.name) || '__home__'} />
  }
}
