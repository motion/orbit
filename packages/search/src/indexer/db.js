import PouchDB from 'pouchdb'

const db = new PouchDB('searchDb')
window.d = db

export default class SearchDB {
  setItem = async (_id, value) => await db.put({ _id, value })

  getItem = _id =>
    new Promise(res => {
      db
        .get(_id)
        .then(doc => res(doc.value))
        .catch(err => res(null))
    })
}
