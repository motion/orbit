import { store } from '~/helpers'

@store
export default class Keys {
  start() {
    console.log('keys', this)
  }
}
