import { OrbitWorkersRoot } from './OrbitWorkersRoot'

export function startDevelopment(appRoot: OrbitWorkersRoot) {
  Error.stackTraceLimit = Infinity

  console.log(`$ NODE_ENV=${process.env.NODE_ENV} run workers`)

  require('source-map-support/register')
  require('./installGlobals').installGlobals(appRoot)

  const exitHandler = async (code?: any) => {
    console.log('handling exit', code)
    try {
      if (await appRoot.dispose()) {
        // otherwise it wont exit :/
        process.kill(process.pid)
      }
    } catch (err) {
      console.log('error killing', err)
    }
  }

  process.on('exit', exitHandler)
}
