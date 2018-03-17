// @flow
import { store } from '@mcro/black'
import { random } from 'lodash'

@store
export default class SearchStore {
  openCalls = {}

  call = (name, args) =>
    new Promise(resolve => {
      const uuid = random(0, 100000)
      this.worker.postMessage({ uuid, name, args })
      this.openCalls[uuid] = data => {
        resolve(data)
      }
    })

  willMount() {
    const url = `http://localhost:3001/search/@mcro-search.js`
    this.worker = new Worker(url)
    this.worker.onerror = err => {
      console.error(err)
    }
    this.worker.onmessage = ({ data }) => {
      this.openCalls[data.uuid](data.data)
      delete this.openCalls[data.uuid]
    }
  }
}
