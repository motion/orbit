import { Bit, Setting, createOrUpdateBit } from '@mcro/models'
import * as _ from 'lodash'
// import debug from '@mcro/debug'
import getHelpers from './getHelpers'

// const log = debug('sync confluenceBit')

export default class ConfluenceBitSync {
  setting: Setting
  helpers = getHelpers({})

  get token() {
    return this.setting.token
  }

  constructor(setting: Setting) {
    this.setting = setting
    this.helpers = getHelpers(setting)
  }

  run = async () => {
    try {
      console.log('running confluence task')
      const res = await this.syncBits()
      console.log('Created', res ? res.length : 0, 'issues', res)
    } catch (err) {
      console.log('Error in confluence task sync', err.message, err.stack)
    }
  }

  syncBits = async () => {
    console.log('do it')
  }

  createIssues = async issues => {
    return Promise.all(issues.map(this.createIssue))
  }

  createIssue = async () => {
    // ensure if one is set, the other gets set too
    // const bitCreatedAt = issue.createdAt || issue.updatedAt || ''
    // const bitUpdatedAt = issue.updatedAt || bitCreatedAt
    // return await createOrUpdateBit(Bit, {
    //   integration: 'github',
    //   identifier: data.id,
    //   type: 'task',
    //   title: issue.title,
    //   body: issue.bodyText,
    //   data,
    //   author: issue.author.login,
    //   bitCreatedAt,
    //   bitUpdatedAt,
    // })
  }
}
