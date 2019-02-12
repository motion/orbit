import { BitModel, PersonBitModel } from '@mcro/models'
import { AppActions } from '../actions/AppActions'
import { AppConfig } from '../apps/AppTypes'

// test page for loading in browser to isolate
export async function setupTestApp(testAppId?: string) {
  if (testAppId === 'bit') {
    const lastBit = await require('../mediator').loadOne(BitModel, { args: {} })
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
  if (testAppId === 'lists') {
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
  if (testAppId === 'topics') {
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
  if (testAppId === 'people') {
    const lastPerson = await require('../mediator').loadOne(PersonBitModel, {
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
