import bootstrap from 'couchdb-bootstrap'
import ensure from 'couchdb-ensure'
import compile from 'couchdb-compile'
import Path from 'path'
import fs from 'fs'

const root = Path.join(__dirname, '..', 'design')

export default function(url = root, write = false) {
  console.log('Bootstrapping...', url, write)

  // ensure dbs created
  const dirs = path =>
    fs
      .readdirSync(root)
      .filter(f => fs.statSync(Path.join(path, f)).isDirectory())

  const dbs = dirs(root)
  for (const db of dbs) {
    const url = `${url}/${db}`
    console.log('ensuring db', db, url)
    ensure(url, handleErr)
  }

  if (write) {
    compile(root, (err, doc) => {
      if (err) {
        console.log('err', err)
        return
      }

      const designDoc = JSON.stringify(doc, 0, 2)

      // write it to fs
      fs.writeFileSync(Path.join(root, 'document.json'), designDoc)
    })
  }

  bootstrap(url, root, (err, res) => {
    if (err) {
      console.log('Error')
      console.log(err)
    } else {
      console.log('Success!')
      console.log(JSON.stringify(res, 0, 2))
    }
  })
}
