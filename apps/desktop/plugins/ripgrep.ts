import execa from 'execa'
import fuzzySort from 'fuzzysort'
import * as Path from 'path'
import os from 'os'

const MAX_PER_DIR = 500
const MAX_SEARCH_TIME = 150
const FUZZY_OPTS = {
  threshold: -150,
  limit: 5,
}

const directories = ['Downloads', 'Documents', 'Desktop'].map(path =>
  Path.join(os.homedir(), path),
)

let procs = []

export const fn = async ({ term, display }) => {
  for (const proc of procs) {
    proc.kill()
  }
  if (!term) {
    return display([])
  }
  const results = []
  await new Promise(finish => {
    for (const dir of directories) {
      const proc = execa('rg', ['--files', '-g', `${term.replace('"', '')}*`], {
        cwd: dir,
      })
      proc.stdout.setEncoding('utf8')
      let fetched = 0
      proc.stdout.on('data', data => {
        fetched++
        if (fetched > MAX_PER_DIR) {
          proc.kill()
        }
        results.push(data)
      })
      proc.then(finish).catch(() => {
        // likely because we killed it
      })
      setTimeout(() => {
        proc.kill()
        finish()
      }, MAX_SEARCH_TIME)
    }
  })
  const filtered = fuzzySort.go(term, results, FUZZY_OPTS)
  const final = filtered.map((x, index) => ({ id: index, title: x.target }))
  console.log('ripgrep results', results, final)
  display(final)
}
