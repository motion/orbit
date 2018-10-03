import { Logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import * as path from 'path'
import { DriveFetcher } from './DriveFetcher'
import {
  googleDriveFileCommentQuery,
  googleDriveFileExportQuery,
  googleDriveFileQuery,
  googleDriveFileRevisionQuery,
} from './DriveQueries'
import { DriveComment, DriveFile, DriveLoadedFile, DriveRevision } from './DriveTypes'
import { uniqBy } from 'lodash'

/**
 * Loads data from google drive api.
 */
export class DriveLoader {
  private log: Logger
  private fetcher: DriveFetcher

  constructor(setting: Setting, log?: Logger) {
    this.fetcher = new DriveFetcher(setting)
    this.log = log || new Logger('service:gdrive:loader:' + setting.id)
  }

  async load(): Promise<DriveLoadedFile[]> {
    const files = await this.loadFiles()
    const driveFiles: DriveLoadedFile[] = []
    for (let file of files) {

      // try to find a file folder to create a Bit.location later on
      let parent: DriveFile
      if (file.parents && file.parents.length)
        parent = files.find(otherFile => otherFile.id === file.parents[0])

      const thumbnailFilePath = await this.downloadThumbnail(file);
      const content = await this.loadFilesContent(file);
      const comments = await this.loadComments(file);
      const revisions = await this.loadRevisions(file);
      const users = [
        ...file.owners,
        ...comments.map(comment => comment.author),
        ...revisions.map(revision => revision.lastModifyingUser),
      ]
        .filter(user => {
          // some users are not defined in where they come from. we skip such cases
          // some users don't have emails. we skip such cases
          // if author of the comment is current user we don't need to add him to users list
          return user && user.emailAddress && user.me === false
        })

      driveFiles.push({
        file,
        thumbnailFilePath,
        content,
        comments,
        revisions,
        users: uniqBy(users, user => user.emailAddress),
        parent,
      })
    }
    return driveFiles
  }

  private async loadFiles(pageToken?: string): Promise<DriveFile[]> {
    const result = await this.fetcher.fetch(googleDriveFileQuery(pageToken))
    if (result.nextPageToken) {
      const nextPageFiles = await this.loadFiles(result.nextPageToken)
      return [...result.files, ...nextPageFiles]
    }
    return result.files
  }

  private async loadFilesContent(file: DriveFile): Promise<string> {
    if (file.mimeType !== 'application/vnd.google-apps.document') return ''

    this.log.verbose(`loading file content for`, file)
    const content = await this.fetcher.fetch(
      googleDriveFileExportQuery(file.id),
    )
    this.log.verbose(`content for file was loaded`, { content })
    return content
  }

  private async loadComments(
    file: DriveFile,
    pageToken?: string,
  ): Promise<DriveComment[]> {
    // for some reason google gives fatal errors when comments for map items are requested, so we skip them
    if (file.mimeType === 'application/vnd.google-apps.map') return []

    this.log.verbose(`loading comments for`, file)
    const result = await this.fetcher.fetch(
      googleDriveFileCommentQuery(file.id, pageToken),
    )
    if (result.nextPageToken) {
      const nextPageComments = await this.loadComments(
        file,
        result.nextPageToken,
      )
      return [...result.comments, ...nextPageComments]
    }
    return result.comments
  }

  private async loadRevisions(
    file: DriveFile,
    pageToken?: string,
  ): Promise<DriveRevision[]> {
    // check if user have access to the revisions of this file
    if (!file.capabilities.canReadRevisions) return []

    this.log.verbose(`loading revisions for`, file)
    const result = await this.fetcher.fetch(
      googleDriveFileRevisionQuery(file.id, pageToken),
    )
    if (result.nextPageToken) {
      const nextPageRevisions = await this.loadRevisions(
        file,
        result.nextPageToken,
      )
      return [...result.revisions, ...nextPageRevisions]
    }
    return result.revisions
  }

  private async downloadThumbnail(file: DriveFile): Promise<string> {
    if (!file.thumbnailLink) return ''

    this.log.verbose(`downloading file thumbnail for`, file)
    const destination = path.normalize(
      __dirname + '/../../../uploads/' + file.id + '.' + file.fileExtension,
    )
    await this.fetcher.downloadFile(file.thumbnailLink, destination)
    this.log.verbose(`thumbnail downloaded and saved as`, destination)
  }
}
