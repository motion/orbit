import debugApps from '@mcro/debug-apps'

async function start() {
  await debugApps({
    sessions: [{ port: '9000' }, { port: '9001' }, { port: '9002' }],
  })
}

start()
