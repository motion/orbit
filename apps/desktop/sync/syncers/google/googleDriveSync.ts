import { Bit, Setting, createOrUpdate } from '@mcro/models'
import debug from '@mcro/debug'
import { sleep } from '@mcro/helpers'
import getHelpers from './getHelpers'
import * as Helpers from '~/helpers'

const log = debug('googleDrive')

type FileObject = {
  name: string
  contents: string
  id: string
  spaces?: [string]
  parents?: [string]
  createdTime: string
  modifiedTime: string
}

type PageQuery = {
  pageToken?: string
}

export default class GoogleDriveSync {
  helpers = getHelpers({})
  setting: Setting

  fetch2 = (path, ...rest) => this.helpers.fetch(`/drive/v2${path}`, ...rest)
  fetch = (path, ...rest) => this.helpers.fetch(`/drive/v3${path}`, ...rest)

  constructor(setting) {
    this.updateSetting(setting)
  }

  updateSetting = async (setting?) => {
    this.setting = setting || (await Setting.findOne({ type: 'google' }))
    this.helpers = getHelpers(this.setting)
  }

  run = async () => {
    await this.updateSetting()
    try {
      await this.syncFiles()
    } catch (err) {
      console.error(`Drive sync error ${err.message}`)
    }
  }

  async syncFeed() {
    const changes = await this.getChanges()
    if (changes && changes.changes) {
      for (const change of changes) {
        console.log('change:', change.fileId, change)
      }
    }
  }

  async syncFiles() {
    const files = await this.getFiles()
    let created = []
    for (const file of files) {
      const result = await this.createFile(file)
      if (result) {
        created.push(result)
      }
    }
    if (created.length) {
      log('synced new files', created)
    }
    return created
  }

  async createFile(info: FileObject) {
    const { name, contents, ...data } = info
    return await createOrUpdate(
      Bit,
      {
        id: info.id,
        integration: 'google',
        identifier: Helpers.hash({
          id: info.id,
          modifiedTime: info.modifiedTime,
        }),
        type: 'document',
        title: name,
        body: contents || 'empty',
        data,
        bitCreatedAt: info.createdTime,
        bitUpdatedAt: info.modifiedTime,
      },
      Bit.identifyingKeys,
    )
  }

  async getRevisions(fileId: string) {
    const { revisions } = await this.fetch(`/files/${fileId}/revisions`, {
      query: {
        pageSize: 1000,
      },
    })
    return await Promise.all(
      revisions.map(({ id }) => this.getRevision(fileId, id)),
    )
  }

  async getRevision(fileId: string, revisionId: string) {
    return await this.fetch(`/files/${fileId}/revisions/${revisionId}`, {
      query: {
        fields: ['lastModifyingUser', 'size', 'mimeType', 'modifiedTime'],
      },
    })
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

  async fetchChanges(lastPageToken?: string, total = 1000) {
    let pageToken = lastPageToken
    if (!pageToken) {
      pageToken = (await this.fetch('/changes/startPageToken')).startPageToken
    }
    const query = {
      supportsTeamDrives: true,
      includeRemoved: true,
      includeTeamDriveItems: true,
      pageSize: Math.min(1000, total),
      spaces: 'drive',
      pageToken: null,
    }
    if (pageToken) {
      query.pageToken = pageToken
    }
    return await this.fetch('/changes', {
      query,
    })
  }

  async getFiles(pages = 1, query?: PageQuery, fileQuery?: Object) {
    const files = await this.getFilesBasic(pages, query)
    // just docs
    const docs = files.filter(
      file => file.mimeType === 'application/vnd.google-apps.document',
    )
    const fileIds = docs.map(file => file.id)
    const perSecond = 5
    let fetched = 0
    let response = []
    while (fetched < fileIds.length) {
      const ids = fileIds.slice(fetched, fetched + perSecond)
      const next = await this.getFilesWithAllInfo(ids, fileQuery)
      response = [...response, ...next]
      fetched = response.length
      // log('getFiles', next, fetched, 'out of', fileIds.length)
      await sleep(2000)
    }
    return response
  }

  getFilesWithAllInfo(
    ids: Array<string>,
    fileQuery?: Object,
  ): Promise<Array<any>> {
    return new Promise(async (res, rej) => {
      const timeout = setTimeout(() => {
        console.log('timeout getting all files')
        res(ids.map(() => null))
      }, 5000)
      const meta = await Promise.all(ids.map(id => this.getFile(id, fileQuery)))
      const contents = await Promise.all(
        ids.map(id => this.getFileContents(id)),
      )
      // zip
      clearTimeout(timeout)
      res(meta.map((file, i) => ({ ...file, contents: contents[i] })))
    })
  }

  async getFilesBasic(pages = 1, query: PageQuery = {}) {
    let all = []
    let fetchedPages = 0
    while (fetchedPages < pages) {
      fetchedPages++
      const res = await this.fetchFiles(query)
      if (res) {
        all = [...all, ...res.files]
        if (res.nextPageToken) {
          query.pageToken = res.nextPageToken
        }
      } else {
        console.error('No res', res, query)
      }
    }
    return all
  }

  async fetchFiles(query?: Object) {
    return await this.fetch('/files', {
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
    return await this.fetch(`/files/${id}`, {
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

  getFileContents(id: string) {
    return new Promise(async (res, rej) => {
      const timeout = setTimeout(() => {
        console.log('timeout getting file contents', id)
        res(null)
      }, 2000)
      const result = await this.fetch(`/files/${id}/export`, {
        type: 'text',
        query: {
          mimeType: 'text/plain',
          alt: 'media',
        },
      })
      clearTimeout(timeout)
      res(result)
    })
  }

  async getTeamDrives() {
    return await this.fetch('/teamdrives')
  }

  async getComments(fileId: string) {
    return await this.fetch(`/files/${fileId}/comments`, {
      query: {
        pageSize: 1000,
      },
    })
  }

  async getReplies(fileId: string, commentId: string) {
    return await this.fetch(`/files/${fileId}/comments/${commentId}/replies`, {
      query: {
        pageSize: 1000,
      },
    })
  }
}
