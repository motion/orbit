import debugApps from '@o/debug-apps'

Error.stackTraceLimit = Infinity

// DEBUG_ELECTRON to open puppeteer with electron main processes
// they dont work well (you can only access globals not see logs)
// so lets avoid clutter unless absolutely wanted

const {
  DISABLE_WORKERS,
  DEBUG_ELECTRON,
  DEBUG_ELECTRON_MAIN = 'true',
  DEBUG_ELECTRON_APPS,
} = process.env

const debugElectron = DEBUG_ELECTRON === 'true'
const debugElectronMain = DEBUG_ELECTRON_MAIN === 'true'
const debugElectronApps = DEBUG_ELECTRON_APPS === 'true'

async function start() {
  const sessions = [
    // node processes
    { port: '9000' }, // desktop

    // electron + remote
    (debugElectron || debugElectronMain) && { port: '9001' },
    { port: '9002' },

    // syncers
    !DISABLE_WORKERS && { port: '9003' },

    // electron apps (look for a few)
    (debugElectron || debugElectronApps) && { port: '9004' },
    { port: '9005' },
    (debugElectron || debugElectronApps) && { port: '9006' },
    { port: '9007' },
    (debugElectron || debugElectronApps) && { port: '9008' },
    { port: '9009' },
  ].filter(Boolean)

  console.log('starting REPL with sessions...', sessions)

  await debugApps({
    sessions,
  })
}

start()
