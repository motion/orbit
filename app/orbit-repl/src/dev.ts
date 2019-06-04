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
  DEBUG_ELECTRON_CHROME,
} = process.env

const debugElectron = DEBUG_ELECTRON === 'true'
const debugElectronMain = DEBUG_ELECTRON_MAIN === 'true'
const debugElectronApps = DEBUG_ELECTRON_APPS === 'true'
const debugElectronChrome = DEBUG_ELECTRON_CHROME === 'true'

async function start() {
  const sessions = [
    // node processes
    { port: '9000' }, // desktop
    (debugElectron || debugElectronMain) && { port: '9001' }, // electron
    !DISABLE_WORKERS && { port: '9003' }, // syncers

    // remote processes
    { port: '9002' }, // electron remote
    (debugElectron || debugElectronApps) && { port: '9004' }, // electron-apps main
    { port: '9005' }, // electron-apps remote
    (debugElectron || debugElectronChrome) && { port: '9006' }, // electron-chrome main
    { port: '9007' }, // electron-menus remote
  ].filter(Boolean)

  console.log('starting REPL with sessions...', sessions)

  await debugApps({
    sessions,
  })
}

start()
