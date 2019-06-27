import { AppBit, getGlobalConfig } from '@o/kit'
import { google } from 'googleapis'
import { MethodOptions } from 'googleapis-common'

const Config = getGlobalConfig()

export default (app: AppBit) => {
  const oauth2Client = new google.auth.OAuth2(
    '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com',
    'LLXP2Vq36socQtgXy_XQqLOW',
    Config.urls.auth + '/auth/gmail/callback',
  )
  oauth2Client.setCredentials({
    access_token: app.token,
    refresh_token: app.data.values.oauth.refreshToken,
  })
  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client,
  })

  return {
    createDraft(params?: any, options?: MethodOptions) {
      return gmail.users.drafts.create(params, options)
    },
    deleteDraft(params?: any, options?: MethodOptions) {
      return gmail.users.drafts.delete(params, options)
    },
    getDraft(params?: any, options?: MethodOptions) {
      return gmail.users.drafts.get(params, options)
    },
    listDrafts(params?: any, options?: MethodOptions) {
      return gmail.users.drafts.list(params, options)
    },
    sendDraft(params?: any, options?: MethodOptions) {
      return gmail.users.drafts.send(params, options)
    },
    updateDraft(params?: any, options?: MethodOptions) {
      return gmail.users.drafts.update(params, options)
    },
    getProfile(params?: any, options?: MethodOptions) {
      return gmail.users.getProfile(params, options)
    },
    historyList(params?: any, options?: MethodOptions) {
      return gmail.users.history.list(params, options)
    },
    createLabel(params?: any, options?: MethodOptions) {
      return gmail.users.labels.create(params, options)
    },
    deleteLabel(params?: any, options?: MethodOptions) {
      return gmail.users.labels.delete(params, options)
    },
    getLabel(params?: any, options?: MethodOptions) {
      return gmail.users.labels.get(params, options)
    },
    listLabel(params?: any, options?: MethodOptions) {
      return gmail.users.labels.list(params, options)
    },
    patchLabel(params?: any, options?: MethodOptions) {
      return gmail.users.labels.patch(params, options)
    },
    updateLabel(params?: any, options?: MethodOptions) {
      return gmail.users.labels.update(params, options)
    },
    getMessageAttachements(params?: any, options?: MethodOptions) {
      return gmail.users.messages.attachments.get(params, options)
    },
    batchDeleteMessages(params?: any, options?: MethodOptions) {
      return gmail.users.messages.batchDelete(params, options)
    },
    batchModifyMessages(params?: any, options?: MethodOptions) {
      return gmail.users.messages.batchModify(params, options)
    },
    deleteMessage(params?: any, options?: MethodOptions) {
      return gmail.users.messages.delete(params, options)
    },
    getMessage(params?: any, options?: MethodOptions) {
      return gmail.users.messages.get(params, options)
    },
    importMessages(params?: any, options?: MethodOptions) {
      return gmail.users.messages.import(params, options)
    },
    insertMessage(params?: any, options?: MethodOptions) {
      return gmail.users.messages.insert(params, options)
    },
    listMessages(params?: any, options?: MethodOptions) {
      return gmail.users.messages.list(params, options)
    },
    modifyMessage(params?: any, options?: MethodOptions) {
      return gmail.users.messages.modify(params, options)
    },
    sendMessage(params?: any, options?: MethodOptions) {
      return gmail.users.messages.send(params, options)
    },
    trashMessage(params?: any, options?: MethodOptions) {
      return gmail.users.messages.trash(params, options)
    },
    untrashMessage(params?: any, options?: MethodOptions) {
      return gmail.users.messages.untrash(params, options)
    },
    deleteThread(params?: any, options?: MethodOptions) {
      return gmail.users.threads.delete(params, options)
    },
    getThread(params?: any, options?: MethodOptions) {
      return gmail.users.threads.get(params, options)
    },
    listThreads(params?: any, options?: MethodOptions) {
      return gmail.users.threads.list(params, options)
    },
    modifyThread(params?: any, options?: MethodOptions) {
      return gmail.users.threads.modify(params, options)
    },
    trashThread(params?: any, options?: MethodOptions) {
      return gmail.users.threads.trash(params, options)
    },
    untrashThread(params?: any, options?: MethodOptions) {
      return gmail.users.threads.untrash(params, options)
    },
  }
}
