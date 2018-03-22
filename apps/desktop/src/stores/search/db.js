import sqlite from 'sqlite'

const dbPromise = sqlite.open('./data/database.sqlite', {
  cached: true,
  Promise,
})
const table = `vectors`

const hashCode = s =>
  s.split('').reduce(function(a, b) {
    a = (a << 5) - a + b.charCodeAt(0)
    return Math.abs(a & a)
  }, 0)

export default class SearchDB {
  mount = async () => {
    const createTable = `create table if not exists ${table} (id TEXT, vector TEXT)`
    const db = await dbPromise
    await db.run(createTable)
  }

  setItem = async (_id, string) => {
    const db = await dbPromise
    const id = hashCode(_id)
    const query = `insert into ${table} (id, vector) values ("${id}", "${string}")`
    try {
      await db.run(query)
      return true
    } catch (err) {
      console.log('error setting database item', err)
    }
  }

  clearAll = async () => {
    const db = await dbPromise
    const query = `delete from ${table}`
    await db.run(query)
  }

  getItem = async _id => {
    const db = await dbPromise
    const id = hashCode(_id)
    const query = `select * from ${table} where id = "${id}"`
    try {
      const val = await db.get(query)
      if (!val) {
        return false
      }

      return JSON.parse(val.vector)
    } catch (err) {
      console.log('error getting database item', err)
    }
  }

  onUnmount = () => {
    this.db.close()
  }
}
