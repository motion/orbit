import debug from 'debug'
const log = debug('search')
log.enabled = true

export default class Search {
  autocomplete = []

  constructor() {
    console.log('in constructor')
    log('hello')
  }

  index = () => {}

  search = text => {
    return []
  }
}
