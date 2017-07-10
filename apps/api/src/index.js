// import 'babel-polyfill'
import API from './api'

console.log('starting api')
const Api = new API({ rootPath: __dirname })

Api.start()
