// import * as path from 'path'
import {
  AppBit,
  getGlobalConfig,
  Logger,
  ServiceLoader,
  ServiceLoaderAppSaveCallback,
  sleep,
} from '@o/kit'
import { uniqBy } from 'lodash'
import { DriveAbout, DriveComment, DriveFile, DriveLoadedFile, DriveRevision } from './DriveModels'
import { DriveQueries } from './DriveQueries'

/**
 * Defines a loading throttling.
 * This is required to not overload user network with service queries.
 */
const THROTTLING = {
  /**
   * Delay before files load.
   */
  files: 100,

  /**
   * Delay before file content load.
   */
  fileContent: 100,

  /**
   * Delay before file comments load.
   */
  comments: 100,

  /**
   * Delay before file revisions load.
   */
  revisions: 100,

  /**
   * Delay before file thumbnail download.
   */
  thumbnailDownload: 100,
}

/**
 * Loads data from google drive api.
 */
export class DriveLoader {
  private app: AppBit
  private log: Logger
  private loader: ServiceLoader

  constructor(app: AppBit, log?: Logger, saveCallback?: ServiceLoaderAppSaveCallback) {
    this.app = app
    this.log = log || new Logger('service:drive:loader:' + app.id)
    this.loader = new ServiceLoader(this.app, this.log, {
      saveCallback,
      baseUrl: 'https://content.googleapis.com/drive/v3',
      headers: {
        Authorization: `Bearer ${this.app.token}`,
        'Access-Control-Allow-Origin': getGlobalConfig().urls.server,
        'Access-Control-Allow-Methods': 'GET',
      },
    })
  }

  /**
   * Loads generation "about" information of current drive account.
   */
  async loadAbout(): Promise<DriveAbout> {
    return await this.loader.load(DriveQueries.about())
  }

  /**
   * Loads google drive files.
   */
  async loadFiles(
    handler: (
      file: DriveLoadedFile,
      cursor?: string,
      isLast?: boolean,
    ) => Promise<boolean> | boolean,
  ): Promise<void> {
    const loadRecursively = async (cursor?: string) => {
      await sleep(THROTTLING.files)

      const { files, nextPageToken } = await this.loader.load(DriveQueries.files(cursor))
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // try to find a file folder to create a Bit.location later on
        let parent: DriveFile | null = null

        if (file.parents && file.parents.length) {
          parent = files.find(otherFile => otherFile.id === file.parents[0])
        }

        // const thumbnailFilePath = await this.downloadThumbnail(file)
        const content = await this.loadFileContent(file)
        const comments = await this.loadComments(file)
        const revisions = await this.loadRevisions(file)
        const users = [
          ...file.owners,
          ...comments.map(comment => comment.author),
          ...revisions.map(revision => revision.lastModifyingUser),
        ].filter(user => {
          // some users are not defined in where they come from. we skip such cases
          // some users don't have emails. we skip such cases
          // if author of the comment is current user we don't need to add him to users list
          return user && user.emailAddress && user.me === false
        })

        const driveFile: DriveLoadedFile = {
          file,
          thumbnailFilePath: '',
          content,
          comments,
          revisions,
          users: uniqBy(users, user => user.emailAddress),
          // @ts-ignore
          parent,
        }
        try {
          const isLast = i === files.length - 1 && !!nextPageToken
          const result = await handler(driveFile, nextPageToken, isLast)

          // if callback returned true we don't continue syncing
          if (result === false) {
            this.log.info('stopped issues syncing, no need to sync more', {
              file: driveFile,
              index: i,
            })
            return // return from the function, not from the loop!
          }
        } catch (error) {
          this.log.warning('error during file handling', driveFile, error)
        }
      }

      if (nextPageToken) {
        await loadRecursively(nextPageToken)
      }
    }

    this.log.timer('load files and people from API')
    await loadRecursively()
    this.log.timer('load files and people from API')
  }

  /**
   * Loads file's content.
   */
  private async loadFileContent(file: DriveFile): Promise<string> {
    if (file.mimeType !== 'application/vnd.google-apps.document') return ''

    await sleep(THROTTLING.fileContent)

    this.log.verbose('loading file content for', file)
    const content = await this.loader.load(DriveQueries.fileExport(file.id))
    this.log.verbose('content for file was loaded', { content })
    return content
  }

  /**
   * Loads file comments.
   */
  private async loadComments(file: DriveFile, pageToken?: string): Promise<DriveComment[]> {
    // for some reason google gives fatal errors when comments for map items are requested, so we skip them
    if (
      file.mimeType === 'application/vnd.google-apps.map' ||
      file.mimeType === 'application/vnd.google-apps.script'
    )
      return []

    await sleep(THROTTLING.comments)

    this.log.verbose('loading comments for', file)
    const result = await this.loader.load(DriveQueries.fileComments(file.id, pageToken))
    if (result.nextPageToken) {
      const nextPageComments = await this.loadComments(file, result.nextPageToken)
      return [...result.comments, ...nextPageComments]
    }
    return result.comments
  }

  /**
   * Loads file revisions.
   */
  private async loadRevisions(file: DriveFile, pageToken?: string): Promise<DriveRevision[]> {
    // check if user have access to the revisions of this file
    if (!file.capabilities.canReadRevisions) return []

    // for some reason google gives fatal errors when comments for map items are requested, so we skip them
    if (
      file.mimeType === 'application/vnd.google-apps.map' ||
      file.mimeType === 'application/vnd.google-apps.script'
    )
      return []

    await sleep(THROTTLING.revisions)

    this.log.verbose('loading revisions for', file)
    const result = await this.loader.load(DriveQueries.fileRevisions(file.id, pageToken))
    if (result.nextPageToken) {
      const nextPageRevisions = await this.loadRevisions(file, result.nextPageToken)
      return [...result.revisions, ...nextPageRevisions]
    }
    return result.revisions
  }

  /**
   * Downloads file thumbnail.
   */
  // private async downloadThumbnail(file: DriveFile): Promise<string> {
  //   if (!file.thumbnailLink) return ''

  //   await sleep(THROTTLING.thumbnailDownload)

  //   this.log.verbose('downloading file thumbnail for', file)
  //   const destination = path.normalize(
  //     __dirname + '/../../../../uploads/' + file.id + '.' + file.fileExtension,
  //   )
  //   await this.loader.downloadFile({
  //     path: file.thumbnailLink,
  //     destination,
  //   })
  //   this.log.verbose('thumbnail downloaded and saved as', destination)
  // }
}
