import psTree from 'ps-tree'

export function cleanupChildren() {
  const exitWait = setTimeout(() => {
    console.log('failed to exit gracefully!')
  }, 500)
  return new Promise(res => {
    psTree(process.getuid(), (err, children) => {
      console.log('ps tree got', err, children)
      if (err) {
        console.log('error getting children', err)
        return
      }
      const pids = children.map(x => x.PID)
      console.log('exiting children', pids)
      for (const pid of pids) {
        process.kill(pid)
      }
      clearTimeout(exitWait)
      res()
    })
  })
}
