import { AppBit, getGlobalConfig } from '@o/kit'
import { google } from 'googleapis'
import { MethodOptions } from 'googleapis-common'

const Config = getGlobalConfig()

export default (app: AppBit) => {
  const oauth2Client = new google.auth.OAuth2(
    '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com',
    'LLXP2Vq36socQtgXy_XQqLOW',
    Config.urls.auth + '/auth/drive/callback',
  )
  oauth2Client.setCredentials({
    access_token: app.token,
    refresh_token: app.data.values.oauth.refreshToken,
  })
  const gdrive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  })

  return {
    about(params?: any, options?: MethodOptions) {
      return gdrive.about.get(params, options)
    },
    getChangesStartPageToken(params?: any, options?: MethodOptions) {
      return gdrive.changes.getStartPageToken(params, options)
    },
    listChanges(params?: any, options?: MethodOptions) {
      return gdrive.changes.list(params, options)
    },
    createComment(params?: any, options?: MethodOptions) {
      return gdrive.comments.create(params, options)
    },
    deleteComment(params?: any, options?: MethodOptions) {
      return gdrive.comments.delete(params, options)
    },
    getComment(params?: any, options?: MethodOptions) {
      return gdrive.comments.get(params, options)
    },
    listComments(params?: any, options?: MethodOptions) {
      return gdrive.comments.list(params, options)
    },
    updateComment(params?: any, options?: MethodOptions) {
      return gdrive.comments.update(params, options)
    },
    copyFile(params?: any, options?: MethodOptions) {
      return gdrive.files.copy(params, options)
    },
    createFile(params?: any, options?: MethodOptions) {
      return gdrive.files.create(params, options)
    },
    deleteFile(params?: any, options?: MethodOptions) {
      return gdrive.files.delete(params, options)
    },
    emptyTrash(params?: any, options?: MethodOptions) {
      return gdrive.files.emptyTrash(params, options)
    },
    exportFile(params?: any, options?: MethodOptions) {
      return gdrive.files.export(params, options)
    },
    fileGenerateIds(params?: any, options?: MethodOptions) {
      return gdrive.files.generateIds(params, options)
    },
    getFile(params?: any, options?: MethodOptions) {
      return gdrive.files.get(params, options)
    },
    listFiles(params?: any, options?: MethodOptions) {
      return gdrive.files.list(params, options)
    },
    updateFile(params?: any, options?: MethodOptions) {
      return gdrive.files.update(params, options)
    },
    watchFile(params?: any, options?: MethodOptions) {
      return gdrive.files.watch(params, options)
    },
    createPermission(params?: any, options?: MethodOptions) {
      return gdrive.permissions.create(params, options)
    },
    deletePermission(params?: any, options?: MethodOptions) {
      return gdrive.permissions.delete(params, options)
    },
    getPermission(params?: any, options?: MethodOptions) {
      return gdrive.permissions.get(params, options)
    },
    listPermissions(params?: any, options?: MethodOptions) {
      return gdrive.permissions.list(params, options)
    },
    updatePermission(params?: any, options?: MethodOptions) {
      return gdrive.permissions.update(params, options)
    },
    createReply(params?: any, options?: MethodOptions) {
      return gdrive.replies.create(params, options)
    },
    deleteReply(params?: any, options?: MethodOptions) {
      return gdrive.replies.delete(params, options)
    },
    getReply(params?: any, options?: MethodOptions) {
      return gdrive.replies.get(params, options)
    },
    listReplies(params?: any, options?: MethodOptions) {
      return gdrive.replies.list(params, options)
    },
    updateReply(params?: any, options?: MethodOptions) {
      return gdrive.replies.update(params, options)
    },
    deleteRevision(params?: any, options?: MethodOptions) {
      return gdrive.revisions.delete(params, options)
    },
    getRevision(params?: any, options?: MethodOptions) {
      return gdrive.revisions.get(params, options)
    },
    listRevisions(params?: any, options?: MethodOptions) {
      return gdrive.revisions.list(params, options)
    },
    updateRevision(params?: any, options?: MethodOptions) {
      return gdrive.revisions.update(params, options)
    },
    createTeamdrive(params?: any, options?: MethodOptions) {
      return gdrive.teamdrives.create(params, options)
    },
    deleteTeamdrive(params?: any, options?: MethodOptions) {
      return gdrive.teamdrives.delete(params, options)
    },
    getTeamdrive(params?: any, options?: MethodOptions) {
      return gdrive.teamdrives.get(params, options)
    },
    listTeamdrives(params?: any, options?: MethodOptions) {
      return gdrive.teamdrives.list(params, options)
    },
    updateTeamdrive(params?: any, options?: MethodOptions) {
      return gdrive.teamdrives.update(params, options)
    },
  }
}
