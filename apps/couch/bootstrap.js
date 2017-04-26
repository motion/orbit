const bootstrap = require('couchdb-bootstrap')
const ensure = require('couchdb-ensure')
const Path = require('path')
const fs = require('fs')

const root = Path.join(__dirname, 'bootstrap')
const COUCHDB_URL = process.env.COUCHDB_URL

// ensure dbs created
const dirs = path =>
  fs
    .readdirSync(root)
    .filter(f => fs.statSync(Path.join(path, f)).isDirectory())

const dbs = dirs(root)
for (const db of dbs) {
  const url = COUCHDB_URL + '/' + db
  console.log('ensuring db', db, url)
  ensure(url, handleErr)
}

// bootstrap db
console.log('\nBootstrapping...')
bootstrap(COUCHDB_URL, root, handleErr)

function handleErr(err, res) {
  if (err) {
    console.log('Error')
    console.log(err)
  } else {
    console.log(JSON.stringify(res, 0, 2))
  }
}
