import API from './api'

const Api = new API({ rootPath: __dirname })

console.log('starting api')
Api.start()
