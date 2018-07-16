import {
  GoogleDriveCommentResponse,
  GoogleDriveFetchQueryOptions,
  GoogleDriveFileResponse,
  GoogleDriveRevisionResponse,
} from './GoogleDriveTypes'

/**
 * @see https://developers.google.com/drive/api/v3/reference/files/list
 */
export function googleDriveFileQuery(
  pageToken: string,
): GoogleDriveFetchQueryOptions<GoogleDriveFileResponse> {
  return {
    json: true,
    url: '/files',
    query: {
      orderBy: [
        'modifiedByMeTime desc',
        'modifiedTime desc',
        'sharedWithMeTime desc',
        'viewedByMeTime desc',
      ],
      ...(pageToken ? { pageToken: pageToken } : {}),
      fields: [
        'kind',
        'nextPageToken',
        'files(' +
          [
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
          ].join(',') +
          ')',
      ],
    },
  }
}

/**
 * @see https://developers.google.com/drive/api/v3/reference/files/export
 */
export function googleDriveFileExportQuery(
  fileId: string,
): GoogleDriveFetchQueryOptions<string> {
  return {
    url: `/files/${fileId}/export`,
    query: {
      mimeType: 'text/plain',
    },
  }
}

/**
 * @see https://developers.google.com/drive/api/v3/reference/comments/list
 */
export function googleDriveFileCommentQuery(
  fileId: string,
  pageToken?: string,
): GoogleDriveFetchQueryOptions<GoogleDriveCommentResponse> {
  return {
    json: true,
    url: `/files/${fileId}/comments`,
    query: {
      pageSize: 100,
      ...(pageToken ? { pageToken: pageToken } : {}),
      fields: [
        'kind',
        'nextPageToken',
        'comments(' + [
          'id',
          'createdTime',
          'author',
          'content'
        ].join(',') + ')'
      ],
    }
  }
}

/**
 * @see https://developers.google.com/drive/api/v3/reference/revisions/list
 */
export function googleDriveFileRevisionQuery(
  fileId: string,
  pageToken?: string,
): GoogleDriveFetchQueryOptions<GoogleDriveRevisionResponse> {
  return {
    json: true,
    url: `/files/${fileId}/revisions`,
    query: {
      pageSize: 1000,
      ...(pageToken ? { pageToken: pageToken } : {}),
      fields: [
        'kind',
        'nextPageToken',
        'revisions(' + [
          'kind',
          'id',
          'mimeType',
          'modifiedTime',
          'keepForever',
          'published',
          'publishAuto',
          'publishedOutsideDomain',
          'lastModifyingUser',
          'originalFilename'
        ].join(',') + ')'
      ],
    }
  }
}
