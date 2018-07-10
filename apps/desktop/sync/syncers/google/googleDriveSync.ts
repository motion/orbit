import { Bit, Setting, createOrUpdateBit } from '@mcro/models'
import debug from '@mcro/debug'
import { DriveService, DriveFileObject } from '@mcro/services'
import TurndownService from 'turndown'

const turndown = new TurndownService()
const htmlToMarkdown = html => turndown.turndown(html)

// TODO: gdocs doesnt rally give us enough for nice markdown
// but we could use the style="" attributes to discern titles from subtitle, paragraphs

function stripHead(rawHtml) {
  return rawHtml.replace(/<head>.*<\/head>/g, '')
}

function stripStyles(rawHtml) {
  return rawHtml.replace(/ style="[^"]+"/g, '')
}

const log = debug('googleDrive')

export default class GoogleDriveSync {
  service: DriveService
  setting: Setting

  constructor(setting) {
    this.updateSetting(setting)
  }

  updateSetting = async (setting?) => {
    this.setting = setting || (await Setting.findOne({ type: 'gdocs' }))
    this.service = new DriveService(this.setting)
  }

  run = async () => {
    await this.updateSetting()
    try {
      await this.syncFiles()
    } catch (err) {
      console.log(`Drive sync error ${err.message}\n${err.stack}`)
    }
  }

  async syncFeed() {
    const changes = await this.service.getChanges()
    // @ts-ignore
    if (changes && changes.changes) {
      for (const change of changes) {
        console.log('change:', change.fileId, change)
      }
    }
  }

  async syncFiles() {
    const files = await this.service.getFiles()
    log(`got ${files.length} files`)
    let created = []
    for (const file of files) {
      const result = await this.createFile(file)
      if (result) {
        created.push(result)
      }
    }
    if (created.length) {
      log(`synced ${created.length} new files`)
    }
    return created
  }

  async createFile(info: DriveFileObject) {
    if (!info) {
      console.log('no info given')
      return null
    }
    const { name, text, html, ...data } = info
    const markdowned = html
      ? htmlToMarkdown(stripStyles(stripHead(html)))
      : text || ''
    return await createOrUpdateBit(Bit, {
      integration: 'gdocs',
      identifier: info.id,
      type: 'document',
      title: name,
      body: text || 'empty',
      data: {
        ...data,
        // storing too much for now just to have flexibility
        htmlBody: html,
        markdownBody: markdowned,
        textBody: text,
      },
      bitCreatedAt: new Date(info.createdTime),
      bitUpdatedAt: new Date(info.modifiedTime),
    })
  }
}
