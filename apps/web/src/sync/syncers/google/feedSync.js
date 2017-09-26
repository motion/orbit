// @flow
import { Event } from '~/app'
import SyncerAction from '../syncerAction'

const sleep = ms => new Promise(res => setTimeout(res, ms))

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

  async syncFiles() {}

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

  async getFiles(query?: Object, fileQuery?: Object) {
    const { files } = await this.getFilesBasic(query)
    // just docs
    const docs = files.filter(
      file => file.mimeType === 'application/vnd.google-apps.document'
    )
    const fileIds = docs.map(file => file.id)
    const perSecond = 5
    let fetched = 0
    let response = []
    while (fetched < fileIds.length) {
      const next = await this.getFilesWithAllInfo(
        fileIds.slice(fetched, fetched + perSecond),
        fileQuery
      )
      console.log('got', next, fetched)
      response = [...response, ...next]
      fetched += perSecond
      await sleep(1000)
    }
    return response
  }

  async getFilesWithAllInfo(ids: Array<number>, fileQuery?: Object) {
    const meta = await Promise.all(ids.map(id => this.getFile(id, fileQuery)))
    const contents = await Promise.all(ids.map(id => this.getFileContents(id)))
    // zip
    return meta.map((file, i) => ({ ...file, contents: contents[i] }))
  }

  async getFilesBasic(query?: Object) {
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
