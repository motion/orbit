import { view } from '~/helpers'
import { Document } from 'models'
import { Page, CircleButton } from '~/views'
import App from 'models'
import Place from './place'

@view
export default class MePage {
  render() {
    return <Place slug={App.user.name} />
  }
}
