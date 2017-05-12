import { view } from '~/helpers'
import { Document } from '@jot/models'
import { Page, CircleButton } from '~/views'
import App from '@jot/models'
import Place from './place'

@view
export default class MePage {
  render() {
    return <Place slug={App.loggedIn && App.user.name} />
  }
}
