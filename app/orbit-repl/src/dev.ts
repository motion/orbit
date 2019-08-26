import debugApps from '@o/debug-apps'

Error.stackTraceLimit = Infinity

// DEBUG_ELECTRON to open puppeteer with electron main processes
// they dont work well (you can only access globals not see logs)
// so lets avoid clutter unless absolutely wanted

const { DISABLE_WORKERS, DISABLE_CHROME } = process.env

async function start() {
  const sessions = [
    // node processes
    { port: '9005' }, // desktop

    // electron + remote
    { port: '9006' },
    { port: '9007' },
    !DISABLE_WORKERS && { port: '9008' },
    !DISABLE_CHROME && { port: '9009' },
    !DISABLE_CHROME && { port: '9010' },

    // electron apps (look for a few)
    { port: '9011' },
    { port: '9012' },
    { port: '9013' },
    { port: '9014' },
  ].filter(Boolean)

  console.log('starting REPL with sessions...', sessions)

  await debugApps({
    sessions,
  })
}

start()
