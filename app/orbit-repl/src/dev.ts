import debugApps from '@mcro/debug-apps'

Error.stackTraceLimit = Infinity

async function start() {
  console.log('starting dev browser...')
  await debugApps({
    sessions: [{ port: '9000' }, { port: '9001' }, { port: '9003' }, { port: '9002' }],
  })
}

start()
