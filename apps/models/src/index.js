// export all models
export * from './all'

export default from './app'

export { query } from './helpers'

if (module && module.hot) {
  module.hot.accept(() => {
    console.log('accept @jot/models/index')
    window.App = require('./app').default
  })
}
