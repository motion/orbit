
/**
 * Options based on which fetch query to GoogleDriveApi will be performed.
 */
export type GoogleDriveFetchQueryOptions<_R> = {

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
 * What GoogleDriveApi gives us when we request a list of files.
 *
 * @see https://developers.google.com/drive/api/v3/reference/files/list
 */
export type GoogleDriveFileResponse = {
  nextPageToken: string
  files: GoogleDriveFile[]
}

/**
 * What GoogleDriveApi gives us when we request a list of file comments.
 *
 * @see https://developers.google.com/drive/api/v3/reference/comments/list
 */
export type GoogleDriveCommentResponse = {
  kind: 'drive#commentList'
  nextPageToken: string
  comments: GoogleDriveComment[]
}

/**
 * What GoogleDriveApi gives us when we request a list of file revisions.
 *
 * @see https://developers.google.com/drive/api/v3/reference/revisions/list
 */
export type GoogleDriveRevisionResponse = {
  kind: 'drive#revisionList'
  nextPageToken: string
  revisions: GoogleDriveRevision[]
}

/**
 * Single GoogleDriveApi User resource.
 */
export type GoogleDriveUser = {
  kind: 'drive#user'
  displayName: string
  photoLink: string
  me: boolean
  permissionId: string
  emailAddress: string
}

/**
 * Single GoogleDriveApi File resource.
 *
 * @see https://developers.google.com/drive/api/v3/reference/files#resource
 */
export type GoogleDriveFile = {
  kind: 'drive#file'
  id: string
  name: string
  mimeType: string
  description: string
  starred: boolean
  trashed: boolean
  explicitlyTrashed: boolean
  trashingUser: GoogleDriveUser
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
  sharingUser: GoogleDriveUser
  owners: GoogleDriveUser[]
  teamDriveId: string
  lastModifyingUser: GoogleDriveUser
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
 * Single GoogleDriveApi Comment resource.
 *
 * @see https://developers.google.com/drive/api/v3/reference/comments#resource
 */
export type GoogleDriveComment = {
  kind: 'drive#comment'
  id: string
  createdTime: string
  modifiedTime: string
  author: GoogleDriveUser
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
 * Single GoogleDriveApi Revision resource.
 *
 * @see https://developers.google.com/drive/api/v3/reference/revisions#resource
 */
export type GoogleDriveRevision = {
  kind: 'drive#revision'
  id: string
  mimeType: string
  modifiedTime: string
  keepForever: boolean
  published: boolean
  publishAuto: boolean
  publishedOutsideDomain: boolean
  lastModifyingUser: GoogleDriveUser
  originalFilename: string
  md5Checksum: string
  size: number
}

/**
 * Finally loaded google drive file with all information related to a file.
 */
export type GoogleDriveLoadedFile = {
  file: GoogleDriveFile
  content: string
  thumbnailFilePath: string
  comments: GoogleDriveComment[]
  revisions: GoogleDriveRevision[]
}

/**
 * Finally loaded google drive user with all information related to a user.
 */
export type GoogleDriveLoadedUser = {
  email: string
  name: string
  photo: string
  comments: GoogleDriveComment[]
  revisions: GoogleDriveRevision[]
  files: GoogleDriveFile[]
}