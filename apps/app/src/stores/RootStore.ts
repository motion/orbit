import { store, react } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { sleep, debugState } from '@mcro/black'
import { uniqBy } from 'lodash'
import { modelsList } from '@mcro/models'
import connectModels from '../helpers/connectModels'
import * as appActions from '../actions/appActions'
import { WebSQLClient } from '../helpers/WebSQLClient'

const onPort = async cb => {
  await sleep(200)
  try {
    await fetch('http://localhost:3001')
    cb()
  } catch (_) {
    onPort(cb)
  }
}

@store
export class RootStore {
  client: WebSQLClient
  connecting = false
  connection = null
  started = false
  stores = null
  views = null
  errors = []

  constructor() {
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
  }

  // should be able to run multiple times
  async start({ connectModels }) {
    if (connectModels) {
      await this.connectModels()
      await App.start({
        actions: appActions,
      })
    }
    this.catchErrors()
    this.started = true
  }

  // for debugging why queries are locking
  logQueriesBeforeError = react(
    () => Desktop.state.lastSQLError,
    () => {
      console.log('last queries before error!!!!')
      console.log(this.client.sqlLitePlugin.lastQueryQueue)
    },
  )

  async connectModels() {
    if (this.connection || this.connecting) {
      return
    }
    this.connecting = true
    const { client, connection } = await connectModels(modelsList)
    this.connecting = false
    this.connection = connection
    this.client = client
  }

  async restart() {
    onPort(() => (window.location = window.location))
  }

  handleError = (...errors) => {
    const unique = uniqBy(errors, err => err.name)
    const final = []
    for (const error of unique) {
      try {
        final.push(JSON.parse(error.message))
      } catch (e) {
        final.push({ id: Math.random(), ...error })
      }
    }
    this.errors = uniqBy([...final, ...this.errors], err => err.id)
  }

  catchErrors() {
    window.addEventListener('unhandledrejection', event => {
      event.promise.catch(err => {
        this.handleError({ ...err, reason: event.reason })
      })
    })
  }

  clearErrors = () => {
    this.errors = []
  }
}
