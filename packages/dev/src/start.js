import debugApps from '@mcro/debug-apps'

Error.stackTraceLimit = Infinity

async function start() {
  await debugApps({
    sessions: [{ port: '9000' }, { port: '9001' }, { port: '9002' }],
    expectTabs: 4,
    // tabs: ['localhost:8999']
  })
}

start()
