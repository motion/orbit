import { Bit, Setting, createOrUpdateBit } from '@mcro/models'
import { GoogleDriveFileLoader } from './GoogleDriveFileLoader'
import { GoogleDriveFile } from './GoogleDriveTypes'
import { htmlToMarkdown } from './GoogleDriveUtils'

export default class GoogleDriveSync {
  service: GoogleDriveFileLoader
  setting: Setting

  constructor(setting) {
    this.setting = setting
    this.service = new GoogleDriveFileLoader(this.setting)
  }

  async run(): Promise<Bit[]> {
    try {
      console.log('synchronizing google drive files')
      const files = await this.syncFiles()
      console.log(`created ${files.length} files`, files)
      return files
    } catch (err) {
      console.log('error in google drive sync', err.message, err.stack)
      return []
    }
  }

  private async syncFiles(): Promise<Bit[]> {
    const files = await this.service.getFiles()
    console.log(`got ${files.length} files`)
    const created = await Promise.all(files.map(file => {
      return this.createFile(file)
    }));
    const newlyInserted = created.filter(file => !!file);
    console.log(`synced ${newlyInserted.length} files`)
    return newlyInserted
  }

  private async createFile(file: GoogleDriveFile): Promise<Bit|null> {
    const { name, text, html, ...data } = file
    const markdowned = html ? htmlToMarkdown(html) : text
    return await createOrUpdateBit(Bit, {
      integration: 'gdocs',
      identifier: file.id,
      type: 'document',
      title: name,
      body: text || 'empty',
      data: {
        ...data,
        // storing too much for now just to have flexibility
        htmlBody: html,
        markdownBody: markdowned || '',
        textBody: text,
      },
      bitCreatedAt: new Date(file.createdTime),
      bitUpdatedAt: new Date(file.modifiedTime),
    })
  }

}
