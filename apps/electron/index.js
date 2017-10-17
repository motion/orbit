process.env.NODE_ENV = 'production'
process.env.IS_PROD = true

const electronApp = require('./dist/index').default
electronApp()

setTimeout(() => {
  const startApi = require('@mcro/api').default
  startApi().then(() => {
    console.log('started')
  })
}, 100)
