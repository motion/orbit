import debugApps from '@mcro/debug-apps'

Error.stackTraceLimit = Infinity

// DEBUG_ELECTRON to open puppeteer with electron main processes
// they dont work well (you can only access globals not see logs)
// so lets avoid clutter unless absolutely wanted

const {
  DISABLE_SYNCERS,
  DEBUG_ELECTRON,
  DEBUG_ELECTRON_MAIN,
  DEBUG_ELECTRON_APPS,
  DEBUG_ELECTRON_CHROME,
} = process.env

async function start() {
  const sessions = [
    // node processes
    { port: '9000' }, // desktop
    (DEBUG_ELECTRON || DEBUG_ELECTRON_MAIN) && { port: '9001' }, // electron
    !DISABLE_SYNCERS && { port: '9003' }, // syncers

    // remote processes
    { port: '9002' }, // electron remote
    (DEBUG_ELECTRON || DEBUG_ELECTRON_APPS) && { port: '9004' }, // electron-apps main
    { port: '9005' }, // electron-apps remote
    (DEBUG_ELECTRON || DEBUG_ELECTRON_CHROME) && { port: '9006' }, // electron-chrome main
    { port: '9007' }, // electron-menus remote
  ].filter(Boolean)
  console.log('starting REPL with sessions...', sessions)
  await debugApps({
    sessions,
  })
}

start()
