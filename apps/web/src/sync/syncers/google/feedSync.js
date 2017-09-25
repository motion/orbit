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

  async getRevisions(id: string) {
    return await this.helpers.fetch(`/files/${id}/revisions`, {
      query: {
        pageSize: 1000,
      },
    })
  }

  async getRevision(fileId: string, revisionId: string) {
    return await this.helpers.fetch(
      `/files/${fileId}/revisions/${revisionId}`,
      {
        query: {
          fields: [
            'lastModifyingUser',
            'lastModifyingUser.displayName',
            'lastModifyingUser.photoLink',
            'lastModifyingUser.permissionId',
            'lastModifyingUser.emailAddress',
            'size',
            'mimeType',
            'modifiedTime',
          ].join(','),
        },
      }
    )
  }

  async getChanges({ max = 5000, maxRequests = 20 } = {}) {
    let { changes, newStartPageToken } = await this.fetchChanges()
    let requests = 0
    while (changes.length < max && requests < maxRequests) {
      requests++
      newStartPageToken--
      const next = await this.fetchChanges(newStartPageToken)
      changes = [...changes, ...next.changes]
    }
    return changes
  }

  async fetchChanges(lastPageToken: string, total = 1000) {
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
        pageSize: Math.min(1000, total),
        spaces: 'drive',
      },
    })
  }

  async syncFiles() {
    const files = await this.getFiles()
  }

  async getFiles() {
    return await this.helpers.fetch('/files', {
      query: {
        orderBy:
          'modifiedByMeTime desc,modifiedTime desc,sharedWithMeTime desc,viewedByMeTime desc',
      },
    })
  }

  async getFile(id: string) {
    return await this.helpers.fetch(`/files/${id}`)
  }

  async getFileContents(id: string, revisionId?: string) {
    return await this.helpers.fetch(`/files/${id}/export`, {
      type: 'text',
      query: {
        mimeType: 'text/plain',
        revision: revisionId,
        alt: 'media',
      },
    })
  }
}
