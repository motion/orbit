import { AppConfig, BitModel, PersonBitModel } from '@mcro/models'
import { AppActions } from '../actions/AppActions'
import { IS_ELECTRON } from '../constants'

// test page for loading in browser to isolate
export async function setupTestApp() {
  if (!IS_ELECTRON) {
    const test = async () => {
      const TEST_APP = window.location.search
        ? window.location.search.match(/app=([a-z]+)/)[1]
        : null

      if (TEST_APP) {
        console.log('TEST_APP', TEST_APP)
        if (TEST_APP === 'bit') {
          const lastBit = await require('@mcro/model-bridge').loadOne(BitModel, { args: {} })
          AppActions.setPeekApp({
            position: [0, 0],
            size: [400, 400],
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
            appConfig: {
              id: `${lastPerson.id}`,
              title: lastPerson.title,
              type: 'people',
            } as AppConfig,
          })
        }
      }
    }
    test()
  }
}
