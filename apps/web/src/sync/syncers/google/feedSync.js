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

  async getRevisions(fileId: string) {
    const {
      revisions,
    } = await this.helpers.fetch(`/files/${fileId}/revisions`, {
      query: {
        pageSize: 1000,
      },
    })
    return await Promise.all(
      revisions.map(({ id }) => this.getRevision(fileId, id))
    )
  }

  async getRevision(fileId: string, revisionId: string) {
    return await this.helpers.fetch(
      `/files/${fileId}/revisions/${revisionId}`,
      {
        query: {
          fields: ['lastModifyingUser', 'size', 'mimeType', 'modifiedTime'],
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

  async syncFiles() {}

  async getFilesWithContents(query?: Object, fileQuery?: Object) {
    const { files } = await this.getFiles(query)
    const filesFilled = await Promise.all(
      files.map(({ id }) => this.getFile(id, fileQuery))
    )
    return filesFilled
  }

  async getFiles(query?: Object) {
    return await this.helpers.fetch('/files', {
      query: {
        orderBy: [
          'modifiedByMeTime desc',
          'modifiedTime desc',
          'sharedWithMeTime desc',
          'viewedByMeTime desc',
        ],
        ...query,
      },
    })
  }

  async getFile(id: string, query?: Object) {
    return await this.helpers.fetch(`/files/${id}`, {
      query: {
        fields: [
          'id',
          'name',
          'mimeType',
          'description',
          'starred',
          'trashed',
          'parents',
          'properties',
          'spaces',
          'version',
          'webContentLink',
          'iconLink',
          'thumbnailLink',
          'viewedByMe',
          'viewedByMeTime',
          'createdTime',
          'modifiedTime',
          'sharingUser',
          'owners',
          'shared',
          'ownedByMe',
          'folderColorRgb',
          'originalFilename',
          'fileExtension',
          'size',
          'capabilities',
          'modifiedByMe',
          'teamDriveId',
        ],
        ...query,
      },
    })
  }

  async getFileContents(id: string) {
    return await this.helpers.fetch(`/files/${id}/export`, {
      type: 'text',
      query: {
        mimeType: 'text/plain',
        alt: 'media',
      },
    })
  }

  async getTeamDrives() {
    return await this.helpers.fetch('/teamdrives')
  }

  async getComments(fileId: string) {
    return await this.helpers.fetch(`/files/${fileId}/comments`, {
      query: {
        pageSize: 1000,
      },
    })
  }

  async getReplies(fileId: string, commentId: string) {
    return await this.helpers.fetch(
      `/files/${fileId}/comments/${commentId}/replies`,
      {
        query: {
          pageSize: 1000,
        },
      }
    )
  }
}
