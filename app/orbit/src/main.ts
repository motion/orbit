import { setGlobalConfig, GlobalConfig } from '@mcro/config'
import { handleErrors } from './handleErrors'

// setup process error watching before doing most stuff
handleErrors()

Error.stackTraceLimit = Infinity

// this runs as the entry for both processes
// first electron, then desktop
// this lets us share config more easily
// and also use the bundled electron binary as the entry point
// which lets us pack things into an asar
export async function main() {
  // if were in desktop we get config through here
  let config: GlobalConfig = process.env.ORBIT_CONFIG ? JSON.parse(process.env.ORBIT_CONFIG) : null

  // if not we're in the root electron process, lets set it up once...
  if (!config) {
    config = await require('./getInitialConfig').getInitialConfig()
  }

  // both processes now run this part to have their config setup
  setGlobalConfig(config)

  // IS IN DESKTOP
  // go off and do its thing...
  if (process.env.IS_DESKTOP) {
    if (!config) {
      throw new Error('Desktop didn\'t receive config!')
    }
    // lets run desktop now
    return require('@mcro/orbit-desktop').main()
  }

  await require('./startElectron').startElectron()
  console.log('Started Electron!')
}

// self starting
main()
