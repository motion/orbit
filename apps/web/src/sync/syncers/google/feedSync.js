// @flow
import { Event } from '~/app'
import SyncerAction from '../syncerAction'

export default class GoogleFeedSync extends SyncerAction {
  run = async () => {
    console.log('run google feed')
    const { startPageToken } = await this.helpers.fetch(
      '/changes/startPageToken'
    )
    console.log('startPageToken', startPageToken)
    const changes = await this.helpers.fetch('/changes', {
      query: {
        pageToken: startPageToken - 2,
        supportsTeamDrives: true,
        includeRemoved: true,
        includeTeamDriveItems: true,
        pageSize: 1000,
        spaces: 'drive',
      },
    })

    console.log('changes', changes)

    const files = await this.helpers.fetch('/files', {
      query: {
        orderBy:
          'modifiedByMeTime desc,modifiedTime desc,sharedWithMeTime desc,viewedByMeTime desc',
      },
    })

    console.log('files', files)

    if (files.files) {
      for (const file of files.files.slice(0, 2)) {
        const info = await this.helpers.fetch(`/files/${file.id}`)
        const body = await this.helpers.fetch(`/files/${file.id}/export`, {
          type: 'text',
          query: {
            mimeType: 'text/plain',
          },
        })
        console.log('res', info, body)
      }
    }

    // console.log(
    //   await this.helpers.fetch(
    //     '/files/17AtJsGkCiA1wgyZ8m0nTP_axreF66AbSLtNeTiEO0Pg/watch',
    //     {
    //       method: 'POST',
    //       body: {
    //         kind: 'api#channel',
    //         id: '1',
    //         resourceId: '123',
    //         resourceUri: '1234',
    //         type: 'json',
    //         address: 'http://jot.dev/test',
    //         payload: true,
    //       },
    //     }
    //   )
    // )
  }
}
