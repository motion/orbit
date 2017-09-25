// @flow
import { Event } from '~/app'
import SyncerAction from '../syncerAction'

export default class GoogleFeedSync extends SyncerAction {
  run = async () => {}

  async syncFeed() {
    const changes = await this.getChanges()

    if (changes && changes.changes) {
      for (const change of changes) {
        console.log('change:', change.fileId, change)
      }
    }
  }

  async getChanges(lastPageToken: string) {
    let pageToken = lastPageToken
    if (!pageToken) {
      pageToken = (await this.helpers.fetch('/changes/startPageToken'))
        .startPageToken
    }
    return await this.helpers.fetch('/changes', {
      query: {
        pageToken,
        supportsTeamDrives: true,
        includeRemoved: true,
        includeTeamDriveItems: true,
        pageSize: 1000,
        spaces: 'drive',
      },
    })
  }

  async syncFiles() {
    const files = await this.getFiles()
    if (files.files) {
      for (const file of files.files.slice(0, 2)) {
        const info = await this.helpers.fetch(`/files/${file.id}`)
        const body = await this.helpers.fetch(`/files/${file.id}/export`, {
          type: 'text',
          query: {
            mimeType: 'text/plain',
          },
        })
        console.log('res', info, body)
      }
    }
  }

  async getFiles() {
    return await this.helpers.fetch('/files', {
      query: {
        orderBy:
          'modifiedByMeTime desc,modifiedTime desc,sharedWithMeTime desc,viewedByMeTime desc',
      },
    })
  }
}
