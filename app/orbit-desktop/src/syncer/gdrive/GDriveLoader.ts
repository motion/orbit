import { logger } from '@mcro/logger'
import { sequence } from '../../utils'
import {
  googleDriveFileCommentQuery,
  googleDriveFileExportQuery,
  googleDriveFileQuery,
  googleDriveFileRevisionQuery,
} from './GDriveQueries'
import {
  GDriveComment,
  GDriveFile,
  GDriveLoadedFile,
  GDriveLoadedUser,
  GDriveRevision,
} from './GDriveTypes'
import { GDriveFetcher } from './GDriveFetcher'
import * as path from 'path'
import { SettingEntity } from '../../entities/SettingEntity'

const log = logger('syncer:gdrive')

export class GDriveLoader {
  fetcher: GDriveFetcher
  files: GDriveLoadedFile[] = []
  users: GDriveLoadedUser[] = []

  constructor(setting: SettingEntity) {
    this.fetcher = new GDriveFetcher(setting)
  }

  async load(): Promise<void> {
    log(`loading google drive files`)
    const files = await this.loadFiles()
    log(`loaded ${files.length} files`, files)

    // limit number of files for now
    // files.splice(10, files.length)

    this.files = await sequence(files, async file => {
      // try to find a file folder to create a Bit.location later on
      let parent: GDriveFile
      if (file.parents && file.parents.length)
        parent = files.find(otherFile => otherFile.id === file.parents[0])

      return {
        file,
        content: await this.loadFilesContent(file),
        comments: await this.loadComments(file),
        revisions: await this.loadRevisions(file),
        thumbnailFilePath: await this.downloadThumbnail(file),
        parent,
      }
    })

    log(`aggregating users from loaded files, comments and revisions`)
    this.users = []
    this.files.forEach(file => {
      [
        ...file.file.owners,
        ...file.comments.map(comment => comment.author),
        ...file.revisions.map(revision => revision.lastModifyingUser),
      ]
        .filter(user => {
          // some users are not defined in where they come from. we skip such cases
          // some users don't have emails. we skip such cases
          // if author of the comment is current user we don't need to add him to users list
          return user && user.emailAddress && user.me === false
        })
        .forEach(user => {
          // make sure we don't have duplicate users - find user by email if it already was added
          let foundUser: GDriveLoadedUser = this.users.find(
            foundUser => foundUser.name === user.displayName,
          )
          if (!foundUser) {
            foundUser = {
              email: user.emailAddress,
              name: user.displayName,
              photo: user.photoLink,
              comments: [],
              revisions: [],
              files: [],
            }
            this.users.push(foundUser)
          }

          // push file that user owns if its not exist yet
          if (foundUser.files.indexOf(file.file) === -1)
            foundUser.files.push(file.file)
        })
    })

    log(`created ${this.users.length} users`, this.users)
  }

  private async loadFiles(pageToken?: string): Promise<GDriveFile[]> {
    const result = await this.fetcher.fetch(googleDriveFileQuery(pageToken))
    if (result.nextPageToken) {
      const nextPageFiles = await this.loadFiles(result.nextPageToken)
      return [...result.files, ...nextPageFiles]
    }
    return result.files
  }

  private async loadFilesContent(file: GDriveFile): Promise<string> {
    if (file.mimeType !== 'application/vnd.google-apps.document') return ''

    log(`loading file content for`, file)
    const content = await this.fetcher.fetch(
      googleDriveFileExportQuery(file.id),
    )
    log(`content for file was loaded`, content)
    return content
  }

  private async loadComments(
    file: GDriveFile,
    pageToken?: string,
  ): Promise<GDriveComment[]> {
    // for some reason google gives fatal errors when comments for map items are requested, so we skip them
    if (file.mimeType === 'application/vnd.google-apps.map') return []

    log(`loading comments for`, file)
    const result = await this.fetcher.fetch(
      googleDriveFileCommentQuery(file.id, pageToken),
    )
    if (result.nextPageToken) {
      log(`next page found`)
      const nextPageComments = await this.loadComments(
        file,
        result.nextPageToken,
      )
      return [...result.comments, ...nextPageComments]
    }
    return result.comments
  }

  private async loadRevisions(
    file: GDriveFile,
    pageToken?: string,
  ): Promise<GDriveRevision[]> {
    // check if user have access to the revisions of this file
    if (!file.capabilities.canReadRevisions) return []

    log(`loading revisions for`, file)
    const result = await this.fetcher.fetch(
      googleDriveFileRevisionQuery(file.id, pageToken),
    )
    if (result.nextPageToken) {
      log(`next page found`)
      const nextPageRevisions = await this.loadRevisions(
        file,
        result.nextPageToken,
      )
      return [...result.revisions, ...nextPageRevisions]
    }
    return result.revisions
  }

  private async downloadThumbnail(file: GDriveFile): Promise<string> {
    if (!file.thumbnailLink) return ''

    log(`downloading file thumbnail for`, file)
    const destination = path.normalize(
      __dirname + '/../../../uploads/' + file.id + '.' + file.fileExtension,
    )
    await this.fetcher.downloadFile(file.thumbnailLink, destination)
    log(`thumbnail downloaded and saved as`, destination)
  }
}
