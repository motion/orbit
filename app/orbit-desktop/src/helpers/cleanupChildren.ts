import psTree from 'ps-tree'

export function cleanupChildren(pid = process.getuid()) {
  console.log(`Cleaning children of ${pid}...`)
  const exitWait = setTimeout(() => {
    console.log('failed to exit gracefully!')
  }, 500)
  return new Promise(res => {
    psTree(pid, (err, children) => {
      if (err) {
        console.log('error getting children', err)
        return
      }
      try {
        const pids = children.map(x => x.PID)
        for (const pid of pids) {
          try {
            process.kill(pid)
          } catch (err) {
            console.log('err killing', pid, err.message)
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
