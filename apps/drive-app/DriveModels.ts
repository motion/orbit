/**
 * Options based on which fetch query to Google Drive Api will be performed.
 */
export type DriveFetchQueryOptions<_R> = {
  /**
   * Url segment to where query should be performed.
   */
  url: string

  /**
   * Query parameters to be appended to the url.
   */
  query: { [key: string]: any }

  /**
   * Indicates if this query returns a JSON or not.
   */
  json?: boolean
}

/**
 * What Google Drive Api gives us when we request a list of files.
 *
 * @see https://developers.google.com/drive/api/v3/reference/files/list
 */
export type DriveFileResponse = {
  nextPageToken: string
  files: DriveFile[]
}

/**
 * What Google Drive Api gives us when we request a list of file comments.
 *
 * @see https://developers.google.com/drive/api/v3/reference/comments/list
 */
export type DriveCommentResponse = {
  kind: 'drive#commentList'
  nextPageToken: string
  comments: DriveComment[]
}

/**
 * What Google Drive Api gives us when we request a list of file revisions.
 *
 * @see https://developers.google.com/drive/api/v3/reference/revisions/list
 */
export type DriveRevisionResponse = {
  kind: 'drive#revisionList'
  nextPageToken: string
  revisions: DriveRevision[]
}

/**
 * Single Google Drive Api User resource.
 */
export type DriveUser = {
  kind: 'drive#user'
  displayName: string
  photoLink: string
  me: boolean
  permissionId: string
  emailAddress: string
}

/**
 * Single Google Drive Api File resource.
 *
 * @see https://developers.google.com/drive/api/v3/reference/files#resource
 */
export type DriveFile = {
  kind: 'drive#file'
  id: string
  name: string
  mimeType: string
  description: string
  starred: boolean
  trashed: boolean
  explicitlyTrashed: boolean
  trashingUser: DriveUser
  trashedTime: string
  parents: string[]
  properties: { [key: string]: string }
  appProperties: { [key: string]: string }
  spaces: string[]
  version: number
  webContentLink: string
  webViewLink: string
  iconLink: string
  hasThumbnail: boolean
  thumbnailLink: string
  thumbnailVersion: number
  viewedByMe: boolean
  viewedByMeTime: string
  createdTime: string
  modifiedTime: string
  modifiedByMeTime: string
  modifiedByMe: boolean
  sharedWithMeTime: string
  sharingUser: DriveUser
  owners: DriveUser[]
  teamDriveId: string
  lastModifyingUser: DriveUser
  shared: boolean
  ownedByMe: boolean
  capabilities: {
    canAddChildren: boolean
    canChangeCopyRequiresWriterPermission: boolean
    canChangeViewersCanCopyContent: boolean
    canComment: boolean
    canCopy: boolean
    canDelete: boolean
    canDownload: boolean
    canEdit: boolean
    canListChildren: boolean
    canMoveItemIntoTeamDrive: boolean
    canMoveTeamDriveItem: boolean
    canReadRevisions: boolean
    canReadTeamDrive: boolean
    canRemoveChildren: boolean
    canRename: boolean
    canShare: boolean
    canTrash: boolean
    canUntrash: boolean
  }
  viewersCanCopyContent: boolean
  copyRequiresWriterPermission: boolean
  writersCanShare: boolean
  permissions: any[]
  permissionIds: string[]
  hasAugmentedPermissions: boolean
  folderColorRgb: string
  originalFilename: string
  fullFileExtension: string
  fileExtension: string
  md5Checksum: string
  size: number
  quotaBytesUsed: number
  headRevisionId: string
  contentHints: {
    thumbnail: {
      image: string
      mimeType: string
    }
    indexableText: string
  }
  imageMediaMetadata: {
    width: number
    height: number
    rotation: number
    location: {
      latitude: number
      numberitude: number
      altitude: number
    }
    time: string
    cameraMake: string
    cameraModel: string
    exposureTime: number
    aperture: number
    flashUsed: boolean
    focalLength: number
    isoSpeed: number
    meteringMode: string
    sensor: string
    exposureMode: string
    colorSpace: string
    whiteBalance: string
    exposureBias: number
    maxApertureValue: number
    subjectDistance: number
    lens: string
  }
  videoMediaMetadata: {
    width: number
    height: number
    durationMillis: number
  }
  isAppAuthorized: boolean
}

/**
 * Single Google Drive Api Comment resource.
 *
 * @see https://developers.google.com/drive/api/v3/reference/comments#resource
 */
export type DriveComment = {
  kind: 'drive#comment'
  id: string
  createdTime: string
  modifiedTime: string
  author: DriveUser
  htmlContent: string
  content: string
  deleted: boolean
  resolved: boolean
  quotedFileContent: {
    mimeType: string
    value: string
  }
  anchor: string
  replies: any[]
}

/**
 * Single Google Drive Api Revision resource.
 *
 * @see https://developers.google.com/drive/api/v3/reference/revisions#resource
 */
export type DriveRevision = {
  kind: 'drive#revision'
  id: string
  mimeType: string
  modifiedTime: string
  keepForever: boolean
  published: boolean
  publishAuto: boolean
  publishedOutsideDomain: boolean
  lastModifyingUser: DriveUser
  originalFilename: string
  md5Checksum: string
  size: number
}

/**
 * Finally loaded google drive file with all information related to a file.
 */
export type DriveLoadedFile = {
  file: DriveFile
  content: string
  thumbnailFilePath: string
  comments: DriveComment[]
  revisions: DriveRevision[]
  users: DriveUser[]
  parent?: DriveFile
}

/**
 * Drive general information.
 *
 * @see https://developers.google.com/drive/api/v3/reference/about/get
 */
export type DriveAbout = {
  user: DriveUser
}

export interface DriveBitData {
}

/**
 * Google Drive application data.
 */
export interface DriveAppData {
  data: {}
  values: {
    oauth: {
      refreshToken: string
      secret: string
      clientId: string
    }

    lastSync: DriveLastSyncInfo
  }
}

/**
 * Information about last sync.
 * Used to implement partial syncing.
 */
export interface DriveLastSyncInfo {
  
  /**
   * Updated date of the last synced file.
   * We don't need to query files from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: string

  /**
   * Updated date of the last synced file BEFORE sync finish completely.
   *
   * Since we need to save last synced date we cannot use local variable inside syncer until sync process finish
   * because sync process can be stopped and next time start from another point where file updated date will be different.
   *
   * We cannot use lastSyncedDate UNTIL we completely finish sync
   * because if sync stop unfinished and number of total files will change,
   * it will make syncer to drop last cursor but it needs to have a previous value of lastSyncedDate
   * which will become different already, thus invalid.
   */
  lastCursorSyncedDate?: number
}