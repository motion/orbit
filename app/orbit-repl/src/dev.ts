import debugApps from '@mcro/debug-apps'

Error.stackTraceLimit = Infinity

async function start() {
  console.log('starting dev browser...')
  await debugApps({
    sessions: [
      { port: '9000' }, // desktop
      { port: '9001' }, // electron
      { port: '9002' }, // electron remote
      { port: '9003' }, // syncers
      { port: '9004' }, // electron-chrome main
      { port: '9005' }, // electron-chrome remote
    ],
  })
}

start()
