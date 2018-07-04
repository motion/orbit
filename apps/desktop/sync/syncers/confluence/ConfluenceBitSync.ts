import { Bit, Setting, createOrUpdateBit } from '@mcro/models'
// import debug from '@mcro/debug'
import getHelpers from './getHelpers'
import { flatten } from 'lodash'
import TurndownService from 'turndown'

const turndown = new TurndownService()
const htmlToMarkdown = html => turndown.turndown(html)

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
    const contentList = await this.helpers.fetchAll(`/wiki/rest/api/content`)
    console.log('contentList', contentList)
    if (!contentList) {
      console.log('no content found')
      return null
    }
    const contents = flatten(
      await Promise.all(
        contentList.map(content =>
          this.helpers.fetch(`/wiki/rest/api/content/${content.id}`, {
            expand: 'body.storage',
          }),
        ),
      ),
    )
    console.log('contents', contents)
    console.log(
      contents.map(content => {
        return htmlToMarkdown(content.body.storage.value)
      }),
    )
    return []
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
