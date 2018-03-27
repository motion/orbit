import sqlite from 'sqlite'

const table = `jobs`
const hashCode = s =>
  s.split('').reduce(function(a, b) {
    a = (a << 5) - a + b.charCodeAt(0)
    return Math.abs(a & a)
  }, 0)

export default class SyncDB {
  async start() {
    this.db = await sqlite.open('./data/database.sqlite', {
      cached: true,
      Promise,
    })
    await this.db.run(`create table if not exists ${table} (id TEXT, vector TEXT)`)
  }

  dispose = async () => {
    await this.db.close()
  }

  setItem = async (_id, string) => {
    const id = hashCode(_id)
    const query = `insert into ${table} (id, vector) values ("${id}", "${string}")`
    try {
      await this.db.run(query)
      return true
    } catch (err) {
      console.log('error setting database item', err)
    }
  }

  getItem = async _id => {
    const id = hashCode(_id)
    const query = `select * from ${table} where id = "${id}"`
    try {
      const val = await this.db.get(query)
      if (!val) {
        return false
      }
      return JSON.parse(val.vector)
    } catch (err) {
      console.log('error getting database item', err)
    }
  }
}
