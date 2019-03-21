import { ServiceLoaderLoadOptions } from '@o/kit'
import { DriveAbout, DriveCommentResponse, DriveFileResponse, DriveRevisionResponse } from './DriveModels'

/**
 * Queries for Google Drive API.
 */
export class DriveQueries {

  /**
   * @see https://developers.google.com/drive/api/v3/reference/about/get
   */
  static about(): ServiceLoaderLoadOptions<DriveAbout> {
    return {
      cors: true,
      path: '/about',
      query: {
        fields: [
          'user'
        ],
      },
    }
  }

  /**
   * @see https://developers.google.com/drive/api/v3/reference/files/list
   */
  static files(pageToken: string): ServiceLoaderLoadOptions<DriveFileResponse> {
    return {
      cors: true,
      path: '/files',
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
            'webViewLink',
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
  static fileExport(fileId: string): ServiceLoaderLoadOptions<string> {
    return {
      plain: true,
      path: `/files/${fileId}/export`,
      query: {
        mimeType: 'text/plain',
      },
    }
  }

  /**
   * @see https://developers.google.com/drive/api/v3/reference/comments/list
   */
  static fileComments(fileId: string, pageToken?: string): ServiceLoaderLoadOptions<DriveCommentResponse> {
    return {
      cors: true,
      path: `/files/${fileId}/comments`,
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
  static fileRevisions(fileId: string, pageToken?: string): ServiceLoaderLoadOptions<DriveRevisionResponse> {
    return {
      cors: true,
      path: `/files/${fileId}/revisions`,
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
  
  
}
