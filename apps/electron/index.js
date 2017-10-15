process.env.NODE_ENV = 'production'

const electronApp = require('./electron')
electronApp()

setTimeout(() => {
  const startApi = require('@mcro/api').default
  startApi().then(() => {
    console.log('started')
  })
}, 100)
