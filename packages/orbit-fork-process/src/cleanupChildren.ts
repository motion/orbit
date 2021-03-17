import psTree from 'ps-tree'

export function cleanupChildren(pid = process.getuid()) {
  const exitWait = setTimeout(() => {
    console.log('failed to exit gracefully!')
  }, 200)
  return new Promise<void>(res => {
    psTree(pid, (err, children) => {
      if (err) {
        console.log('error getting children', err)
        return
      }
      try {
        const pids = children.map(x => x.PID)
        for (const pid of pids) {
          console.log('dispose proccess', pid)
          try {
            process.kill(pid)
          } catch (err) {
            if (err.message.indexOf('ESRCH') === -1) {
              console.log('err', pid, err.message)
            }
          }
        }
      } catch (err) {
        console.log('err exiting', err)
      }
      clearTimeout(exitWait)
      res()
    })
  })
}
