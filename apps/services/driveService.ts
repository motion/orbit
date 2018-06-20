import { store } from '@mcro/black/store'
import { Setting } from '@mcro/models'
import { getHelpers } from './driveServiceHelpers'
import { DriveServiceHelpers } from './types'
import { sleep } from '@mcro/helpers'

export type DriveFileObject = {
  name: string
  html?: string
  text?: string
  id: string
  spaces?: [string]
  parents?: [string]
  createdTime: string
  modifiedTime: string
}

export type PageQuery = {
  pageToken?: string
  mimeType?: string
}

function stripDriveHtml(rawHtml) {
  return rawHtml ? rawHtml.replace(/@import.*[\n]+/, '') : rawHtml
}

@store
export class DriveService {
  helpers: DriveServiceHelpers
  setting: Setting

  fetch2 = (path, options?) => this.helpers.fetch(`/drive/v2${path}`, options)
  fetch = (path, options?) => this.helpers.fetch(`/drive/v3${path}`, options)

  constructor(setting) {
    this.updateSetting(setting)
  }

  get refreshToken() {
    return this.helpers.refreshToken
  }

  updateSetting = async (setting?) => {
    this.setting = setting || (await Setting.findOne({ type: 'gdocs' }))
    this.helpers = getHelpers(this.setting)
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
      const next = await this.fetchChanges(`${newStartPageToken}`)
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

  async getFiles(
    pages = 1,
    query: PageQuery = { mimeType: 'application/vnd.google-apps.document' },
    fileQuery?: Object,
  ): Promise<DriveFileObject[]> {
    const files = await this.getFilesBasic(pages, query)
    // ensure just docs
    const docs = files.filter(file => file.mimeType === query.mimeType)
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
      await sleep(2500)
    }
    return response
  }

  getFilesWithAllInfo(
    ids: Array<string>,
    fileQuery?: Object,
  ): Promise<DriveFileObject[]> {
    return new Promise(async resolve => {
      const meta = await Promise.all(ids.map(id => this.getFile(id, fileQuery)))
      const contents = await Promise.all(
        ids.map(async id => {
          return Promise.all([
            this.getFileContents(id, 'text/plain'),
            this.getFileContents(id, 'text/html'),
          ])
        }),
      )
      const filesWithInfo = meta.map((file, i) => ({
        ...file,
        text: contents[i][0],
        html: stripDriveHtml(contents[i][1]),
      }))
      // filter out ones that couldnt download contents
      const result = filesWithInfo.filter(x => !!(x.text || x.html))
      resolve(result)
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

  async getFile(id: string, query?: Object): Promise<DriveFileObject> {
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

  getFileContents(
    id: string,
    mimeType = 'text/plain',
    timeout = 2000,
  ): Promise<string> {
    return new Promise(async res => {
      let result
      setTimeout(() => {
        if (!result) {
          console.log('timed out getting', mimeType, id)
          res(null)
        }
      }, timeout)
      result = await this.fetch(`/files/${id}/export`, {
        type: 'text',
        query: {
          mimeType,
          // alt: 'media',
        },
      })
      if (!result) {
        console.log('no results returned for', id)
        res(null)
        return
      }
      if (result[0] === '{') {
        result = JSON.parse(`${result}`)
      }
      if (result.error) {
        console.log('error getting result for', id, result.error)
        res(null)
        return
      }
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
