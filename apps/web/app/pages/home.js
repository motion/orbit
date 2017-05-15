import { view } from '~/helpers'
import { Document } from '@jot/models'
import App from '@jot/models'
import Place from './place'

@view
export default class HomePage {
  render() {
    return (
      <home>
        <Place slug={(App.loggedIn && App.user.name) || '__home__'} />
      </home>
    )
  }

  static style = {
    home: {
      flex: 1,
    },
  }
}
