import debugApps from '@mcro/debug-apps'

Error.stackTraceLimit = Infinity

// DEBUG_ELECTRON to open puppeteer with electron main processes
// they dont work well (you can only access globals not see logs)
// so lets avoid clutter unless absolutely wanted

async function start() {
  const sessions = [
    // node processes
    { port: '9000' }, // desktop
    process.env.DEBUG_ELECTRON && { port: '9001' }, // electron
    !process.env.DISABLE_SYNCERS && { port: '9003' }, // syncers

    // remote processes
    { port: '9002' }, // electron remote
    process.env.DEBUG_ELECTRON && { port: '9004' }, // electron-apps main
    { port: '9005' }, // electron-apps remote
    process.env.DEBUG_ELECTRON && { port: '9006' }, // electron-menus main
    { port: '9007' }, // electron-menus remote
  ].filter(Boolean)
  console.log('starting REPL with sessions...', sessions)
  await debugApps({
    sessions,
  })
}

start()
