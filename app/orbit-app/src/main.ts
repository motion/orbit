import 'react-hot-loader' // must be imported before react
import { setGlobalConfig } from '@mcro/config'
import { App } from '@mcro/stores'
import { configureUseStore } from '@mcro/use-store'
import { viewEmitter } from '@mcro/black'
import { CompositeDisposable } from 'event-kit'
import { IS_ELECTRON } from './constants'
import { AppActions } from './actions/AppActions'
import { AppConfig } from '@mcro/stores'
import { BitModel, PersonBitModel } from '@mcro/models'
import { sleep } from './helpers'

// because for some reason we are picking up electron process.env stuff...
// we want this for web-app because stack traces dont have filenames properly
// see Logger.ts
if (process.env) {
  process.env.STACK_FILTER = 'true'
}

configureUseStore({
  onMount: store => {
    store.subscriptions = new CompositeDisposable()
    if (process.env.NODE_ENV === 'development') {
      viewEmitter.emit('store.mount', { name: store.constructor.name, thing: store })
    }
  },
  onUnmount: store => {
    if (!store.subscriptions) {
      console.log('no subscriptions!', store)
      debugger
    }
    store.subscriptions.dispose()
    if (process.env.NODE_ENV === 'development') {
      viewEmitter.emit('store.unmount', { name: store.constructor.name, thing: store })
    }
  },
})

async function main() {
  // set config before app starts...
  // sometimes express can return a partial response for some reason, so lets retry
  let config
  while (!config) {
    try {
      config = await fetch('/config').then(res => res.json())
    } catch (err) {
      console.log('error getting config, trying again', err)
    }
    if (!config) {
      await sleep(500)
    }
  }
  console.log('app:', window.location.href, config)
  setGlobalConfig(config)

  await App.start()

  if (process.env.NODE_ENV === 'development') {
    // test page for loading in browser to isolate
    if (!IS_ELECTRON) {
      const test = async () => {
        const TEST_APP = window.location.search
          ? window.location.search.match(/app=([a-z]+)/)[1]
          : null

        console.log('TEST_APP', TEST_APP)

        if (TEST_APP === 'bit') {
          const lastBit = await require('@mcro/model-bridge').loadOne(BitModel, { args: {} })
          AppActions.setPeekApp({
            position: [0, 0],
            size: [400, 400],
            appType: 'bit',
            appConfig: {
              id: `${lastBit.id}`,
              title: lastBit.title,
              type: 'bit',
            } as AppConfig,
          })
        }
        if (TEST_APP === 'lists') {
          AppActions.setPeekApp({
            position: [0, 0],
            size: [400, 400],
            appType: 'lists',
            appConfig: {
              id: '0',
              title: 'Lists',
              type: 'lists',
            } as AppConfig,
          })
        }
        if (TEST_APP === 'topics') {
          AppActions.setPeekApp({
            position: [0, 0],
            size: [500, 500],
            appType: 'topics',
            appConfig: {
              id: '1',
              title: 'Topics',
              type: 'topics',
            } as AppConfig,
          })
        }
        if (TEST_APP === 'people') {
          const lastPerson = await require('@mcro/model-bridge').loadOne(PersonBitModel, {
            args: {},
          })
          AppActions.setPeekApp({
            position: [0, 0],
            size: [500, 500],
            appType: 'people',
            appConfig: {
              id: `${lastPerson.id}`,
              title: lastPerson.title,
              type: 'people',
            } as AppConfig,
          })
        }
      }
      test()
    }
  }
  // setup config in test mode...

  // now run app..
  require('./start')
}

main()
