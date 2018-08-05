import { store } from '@mcro/black'
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

/**
 * @deprecated
 */
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
    this.setting = setting
    this.helpers = getHelpers(this.setting)
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
      await sleep(4000)
    }
    return response
  }

  private getFilesWithAllInfo(
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
        html: contents[i][1],
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

  private async fetchFiles(query?: Object) {
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

  private async getFile(id: string, query?: Object): Promise<DriveFileObject> {
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

  private getFileContents(
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
        const { errors } = result.error
        console.log(
          'error getting result for',
          id,
          errors.map(err => err.reason),
        )
        res(null)
        return
      }
      res(result)
    })
  }
}
