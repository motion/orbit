import { Bit, Setting, createOrUpdateBit } from '@mcro/models'
// import debug from '@mcro/debug'
import TurndownService from 'turndown'
import { AtlassianService } from '@mcro/services'

const turndown = new TurndownService()
const htmlToMarkdown = html => turndown.turndown(html)

// const log = debug('sync confluenceBit')

type AtlassianUser = {
  accountId: string
  userKey: string
  username: string
  displayName: string
  profilePicture: { path: string; height: number; width: number }
  latest: boolean
}

type AtlassianContent = {
  body: { storage: { value: string } }
  history: {
    createdDate: string
    createdBy: AtlassianUser
    lastUpdated: {
      by: AtlassianUser
      when: string
    }
  }
  extensions: Object
  id: string
  status: string
  title: string
  type: 'page'
}

type AtlassianObj = {
  response: AtlassianContent
  markdown: string
}

export default class ConfluenceBitSync {
  setting: Setting
  service: AtlassianService

  get token() {
    return this.setting.token
  }

  constructor(setting: Setting) {
    this.setting = setting
    this.service = new AtlassianService(setting)
  }

  run = async (): Promise<Bit[]> => {
    try {
      console.log('running confluence')
      const result = await this.syncBits()
      console.log(
        'Created',
        result ? result.length : 0,
        'confluence items',
        result,
      )
      return result
    } catch (err) {
      console.log('Error in confluence task sync', err.message, err.stack)
      return []
    }
  }

  syncBits = async (): Promise<Bit[]> => {
    const contentList = await this.service.fetchAll(`/wiki/rest/api/content`)
    if (!contentList) {
      console.log('no content found')
      return null
    }
    console.log('contentList', contentList)
    const contents = await Promise.all(
      contentList.map(content =>
        this.service.fetch(`/wiki/rest/api/content/${content.id}`, {
          expand: 'body.storage,history,history.lastUpdated',
        }),
      ),
    )
    console.log('contents', contents)
    const contentsRendered = contents.map(response => {
      return {
        markdown: htmlToMarkdown(response.body.storage.value),
        response,
      }
    })
    return await this.createIssues(contentsRendered)
  }

  createIssues = async (issues: AtlassianObj[]): Promise<Bit[]> => {
    const results = await Promise.all(issues.map(this.createIssue))
    return results.filter(Boolean)
  }

  createIssue = async ({ response, markdown }: AtlassianObj): Promise<Bit> => {
    const bitCreatedAt = response.history.createdDate || ''
    const bitUpdatedAt = response.history.lastUpdated.when || ''
    return await createOrUpdateBit(Bit, {
      integration: 'confluence',
      identifier: response.id,
      type: 'document',
      title: response.title,
      body: markdown,
      data: response,
      author:
        response.history.createdBy.displayName ||
        response.history.createdBy.username,
      bitCreatedAt,
      bitUpdatedAt,
    })
  }
}
