import * as Constants from '@mcro/constants'
import { Setting } from '@mcro/models'
import Strategies from '@mcro/oauth-strategies'
import r2 from '@mcro/r2'
import { GoogleDriveFile, GoogleDriveFileResponse } from './GoogleDriveTypes'

export class GoogleDriveFileLoader {
  setting: Setting

  constructor(setting) {
    this.setting = setting
  }

  async getFiles(): Promise<GoogleDriveFile[]> {
    const files = await this.loadFiles()
    await this.loadFilesContent(files)
    return files
  }

  private async loadFiles(pageToken?: string): Promise<GoogleDriveFile[]> {
    const result = await this.fetchFiles(pageToken)
    if (result.nextPageToken) {
      const nextPageFiles = await this.loadFiles(result.nextPageToken);
      return [...result.files, ...nextPageFiles];
    }

    return result.files;
  }

  private fetchFiles(pageToken?: string): Promise<GoogleDriveFileResponse> {
    return this.load('/files', true, {
      orderBy: [
        'modifiedByMeTime desc',
        'modifiedTime desc',
        'sharedWithMeTime desc',
        'viewedByMeTime desc',
      ],
      ...(pageToken ? { pageToken: pageToken } : {}),
      fields: [
        'kind',
        // 'incompleteSearch',
        'nextPageToken',
        'files(' + [
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
        ].join(',') + ')'
      ],
    })
  }

  private async loadFilesContent(files: any[]): Promise<void> {
    await Promise.all(
      files.map(async file => {
        file.html = '';
        file.text = '';
        if (file.mimeType === 'application/vnd.google-apps.document') {
          file.text = await this.load(`/files/${file.id}/export`, false, {
            mimeType: 'text/plain',
          })
        }
      }),
    )
  }

  private async load(path: string, json: boolean = false, query: any) {
    const qs = Object.keys(query).map(key => key + "=" + query[key]).join("&");
    const response = await fetch(`https://content.googleapis.com/drive/v3${path}?${qs}`, {
      mode: json ? 'cors' : undefined,
      headers: {
        'Authorization': `Bearer ${this.setting.token}`,
        'Access-Control-Allow-Origin': Constants.API_URL,
        'Access-Control-Allow-Methods': 'GET',
      },
    })
    const result = json ? await response.json() : await response.text();
    if (result.error && result.error.code === 401/* && !isRetrying*/) {
      const didRefresh = await this.refreshToken()
      if (didRefresh) {
        return await this.load(path, json, query)
      } else {
        console.error('Couldnt refresh access token :(', result)
        throw result.error
      }
    } else if (result.error) {
      console.log('error getting result for', result.error)
      throw result.error;
    }
    return result
  }

  // refresh token functionality should be part of settings functionality!
  private async refreshToken() {
    if (!this.setting.values.oauth.refreshToken) {
      return null
    }
    const reply = await r2.post('https://www.googleapis.com/oauth2/v4/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      formData: {
        refresh_token: this.setting.values.oauth.refreshToken,
        client_id: Strategies.gmail.config.credentials.clientID,
        client_secret: Strategies.gmail.config.credentials.clientSecret,
        grant_type: 'refresh_token',
      },
    }).json
    if (reply && reply.access_token) {
      this.setting.token = reply.access_token
      await this.setting.save()
      return true
    }
    return false
  }

}
