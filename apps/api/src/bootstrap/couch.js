import bootstrap from 'couchdb-bootstrap'
import ensure from 'couchdb-ensure'
import compile from 'couchdb-compile'
import Path from 'path'
import fs from 'fs'

const handleErr = (err, res) => {
  if (err) {
    console.log('Error')
    console.log(err)
  } else {
    console.log('Success!')
    console.log(JSON.stringify(res, 0, 2))
  }
}

export default class Couch {
  constructor({ databaseUrl, designPath }) {
    this.databaseUrl = databaseUrl
    this.designPath = designPath
  }

  start({ write = true } = {}) {
    console.log('Bootstrapping...', this.designPath, this.databaseUrl, write)

    // ensure dbs created
    const dirs = path =>
      fs
        .readdirSync(this.designPath)
        .filter(f => fs.statSync(Path.join(path, f)).isDirectory())

    const dbs = dirs(this.designPath)

    for (const db of dbs) {
      const dbUrl = `${this.databaseUrl}/${db}`
      console.log('ensuring db:', db, dbUrl)
      ensure(dbUrl, handleErr)
    }

    if (write) {
      compile(this.designPath, (err, doc) => {
        if (err) {
          console.log('err', err)
          return
        }

        const designDoc = JSON.stringify(doc, 0, 2)
        // console.log('wrote', designDoc)
      })
    }
  }

  dispose() {}
}
