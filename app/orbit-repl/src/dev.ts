import debugApps from '@mcro/debug-apps'

Error.stackTraceLimit = Infinity

// DEBUG_ELECTRON to open puppeteer with electron main processes
// they dont work well (you can only access globals not see logs)
// so lets avoid clutter unless absolutely wanted

async function start() {
  console.log('starting dev browser...')
  await debugApps({
    sessions: [
      { port: '9000' }, // desktop
      process.env.DEBUG_ELECTRON && { port: '9001' }, // electron
      { port: '9002' }, // electron remote
      { port: '9003' }, // syncers
      process.env.DEBUG_ELECTRON && { port: '9004' }, // electron-chrome main
      { port: '9005' }, // electron-chrome remote
    ].filter(Boolean),
  })
}

start()
