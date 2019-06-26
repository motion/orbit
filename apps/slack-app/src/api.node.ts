import { AppBit } from '@o/kit'
import 'slack'
import {
  api,
  apps,
  auth,
  bots,
  channels,
  chat,
  conversations,
  dialog,
  dnd,
  emoji,
  files,
  groups,
  im,
  migration,
  mpim,
  oauth,
  pins,
  reactions,
  reminders,
  rtm,
  search,
  stars,
  team,
  usergroups,
  users,
} from 'slack'

export default (app: AppBit) => {
  return {
    apiTest() {
      const params = { token: app.token }
      return api.test(params)
    },
    appsPermissionsInfo(params?: Apps.Permissions.Info.Params) {
      params = { ...params, token: app.token }
      return apps.permissions.info(params)
    },
    appsPermissionsRequest(params?: Apps.Permissions.Request.Params) {
      params = { ...params, token: app.token }
      return apps.permissions.request(params)
    },
    appsPermissionsResourcesList(params?: Apps.Permissions.Resources.List.Params) {
      params = { ...params, token: app.token }
      return apps.permissions.resources.list(params)
    },
    appsPermissionsScopesList(params?: Apps.Permissions.Scopes.List.Params) {
      params = { ...params, token: app.token }
      return apps.permissions.scopes.list(params)
    },
    appsPermissionsUsersList(params?: Apps.Permissions.Users.List.Params) {
      params = { ...params, token: app.token }
      return apps.permissions.users.list(params)
    },
    appsPermissionsUsersRequest(params?: Apps.Permissions.Users.Request.Params) {
      params = { ...params, token: app.token }
      return apps.permissions.users.request(params)
    },
    appsUninstall(params?: Apps.Uninstall.Params) {
      params = { ...params, token: app.token }
      return apps.uninstall(params)
    },
    authRevoke(params?: Auth.Revoke.Params) {
      params = { ...params, token: app.token }
      return auth.revoke(params)
    },
    authTest(params?: Auth.Test.Params) {
      params = { ...params, token: app.token }
      return auth.test(params)
    },
    botsInfo(params?: Bots.Info.Params) {
      params = { ...params, token: app.token }
      return bots.info(params)
    },
    channelsArchive(params?: Channels.Archive.Params) {
      params = { ...params, token: app.token }
      return channels.archive(params)
    },
    channelsCreate(params?: Channels.Create.Params) {
      params = { ...params, token: app.token }
      return channels.create(params)
    },
    channelsHistory(params?: Channels.History.Params) {
      params = { ...params, token: app.token }
      return channels.history(params)
    },
    channelsInfo(params?: Channels.Info.Params) {
      params = { ...params, token: app.token }
      return channels.info(params)
    },
    channelsInvite(params?: Channels.Invite.Params) {
      params = { ...params, token: app.token }
      return channels.invite(params)
    },
    channelsJoin(params?: Channels.Join.Params) {
      params = { ...params, token: app.token }
      return channels.join(params)
    },
    channelsKick(params?: Channels.Kick.Params) {
      params = { ...params, token: app.token }
      return channels.kick(params)
    },
    channelsLeave(params?: Channels.Leave.Params) {
      params = { ...params, token: app.token }
      return channels.leave(params)
    },
    channelsList(params?: Channels.List.Params) {
      params = { ...params, token: app.token }
      return channels.list(params)
    },
    channelsMark(params?: Channels.Mark.Params) {
      params = { ...params, token: app.token }
      return channels.mark(params)
    },
    channelsRename(params?: Channels.Rename.Params) {
      params = { ...params, token: app.token }
      return channels.rename(params)
    },
    channelsReplies(params?: Channels.Replies.Params) {
      params = { ...params, token: app.token }
      return channels.replies(params)
    },
    channelsSetPurpose(params?: Channels.SetPurpose.Params) {
      params = { ...params, token: app.token }
      return channels.setPurpose(params)
    },
    channelsSetTopic(params?: Channels.SetTopic.Params) {
      params = { ...params, token: app.token }
      return channels.setTopic(params)
    },
    channelsUnarchive(params?: Channels.Unarchive.Params) {
      params = { ...params, token: app.token }
      return channels.unarchive(params)
    },
    chatDelete(params?: Chat.Delete.Params) {
      params = { ...params, token: app.token }
      return chat.delete(params)
    },
    chatGetPermalink(params?: Chat.GetPermalink.Params) {
      params = { ...params, token: app.token }
      return chat.getPermalink(params)
    },
    chatMeMessage(params?: Chat.MeMessage.Params) {
      params = { ...params, token: app.token }
      return chat.meMessage(params)
    },
    chatPostEphemeral(params?: Chat.PostEphemeral.Params) {
      params = { ...params, token: app.token }
      return chat.postEphemeral(params)
    },
    chatPostMessage(params?: Chat.PostMessage.Params) {
      params = { ...params, token: app.token }
      return chat.postMessage(params)
    },
    chatUnfurl(params?: Chat.Unfurl.Params) {
      params = { ...params, token: app.token }
      return chat.unfurl(params)
    },
    chatUpdate(params?: Chat.Update.Params) {
      params = { ...params, token: app.token }
      return chat.update(params)
    },
    conversationsArchive(params?: Conversations.Archive.Params) {
      params = { ...params, token: app.token }
      return conversations.archive(params)
    },
    conversationsClose(params?: Conversations.Close.Params) {
      params = { ...params, token: app.token }
      return conversations.close(params)
    },
    conversationsCreate(params?: Conversations.Create.Params) {
      params = { ...params, token: app.token }
      return conversations.create(params)
    },
    conversationsHistory(params?: Conversations.History.Params) {
      params = { ...params, token: app.token }
      return conversations.history(params)
    },
    conversationsInfo(params?: Conversations.Info.Params) {
      params = { ...params, token: app.token }
      return conversations.info(params)
    },
    conversationsInvite(params?: Conversations.Invite.Params) {
      params = { ...params, token: app.token }
      return conversations.invite(params)
    },
    conversationsJoin(params?: Conversations.Join.Params) {
      params = { ...params, token: app.token }
      return conversations.join(params)
    },
    conversationsKick(params?: Conversations.Kick.Params) {
      params = { ...params, token: app.token }
      return conversations.kick(params)
    },
    conversationsLeave(params?: Conversations.Leave.Params) {
      params = { ...params, token: app.token }
      return conversations.leave(params)
    },
    conversationsList(params?: Conversations.List.Params) {
      params = { ...params, token: app.token }
      return conversations.list(params)
    },
    conversationsMembers(params?: Conversations.Members.Params) {
      params = { ...params, token: app.token }
      return conversations.members(params)
    },
    conversationsOpen(params?: Conversations.Open.Params) {
      params = { ...params, token: app.token }
      return conversations.open(params)
    },
    conversationsRename(params?: Conversations.Rename.Params) {
      params = { ...params, token: app.token }
      return conversations.rename(params)
    },
    conversationsReplies(params?: Conversations.Replies.Params) {
      params = { ...params, token: app.token }
      return conversations.replies(params)
    },
    conversationsSetPurpose(params?: Conversations.SetPurpose.Params) {
      params = { ...params, token: app.token }
      return conversations.setPurpose(params)
    },
    conversationsSetTopic(params?: Conversations.SetTopic.Params) {
      params = { ...params, token: app.token }
      return conversations.setTopic(params)
    },
    conversationsUnarchive(params?: Conversations.Unarchive.Params) {
      params = { ...params, token: app.token }
      return conversations.unarchive(params)
    },
    dialogOpen(params?: Dialog.Open.Params) {
      params = { ...params, token: app.token }
      return dialog.open(params)
    },
    dndEndDnd(params?: Dnd.EndDnd.Params) {
      params = { ...params, token: app.token }
      return dnd.endDnd(params)
    },
    dndEndSnooze(params?: Dnd.EndSnooze.Params) {
      params = { ...params, token: app.token }
      return dnd.endSnooze(params)
    },
    dndInfo(params?: Dnd.Info.Params) {
      params = { ...params, token: app.token }
      return dnd.info(params)
    },
    dndSetSnooze(params?: Dnd.SetSnooze.Params) {
      params = { ...params, token: app.token }
      return dnd.setSnooze(params)
    },
    dndTeamInfo(params?: Dnd.TeamInfo.Params) {
      params = { ...params, token: app.token }
      return dnd.teamInfo(params)
    },
    emojiList(params?: Emoji.List.Params) {
      params = { ...params, token: app.token }
      return emoji.list(params)
    },
    filesCommentsAdd(params?: Files.Comments.Add.Params) {
      params = { ...params, token: app.token }
      return files.comments.add(params)
    },
    filesCommentsDelete(params?: Files.Comments.Delete.Params) {
      params = { ...params, token: app.token }
      return files.comments.delete(params)
    },
    filesCommentsEdit(params?: Files.Comments.Edit.Params) {
      params = { ...params, token: app.token }
      return files.comments.edit(params)
    },
    filesDelete(params?: Files.Delete.Params) {
      params = { ...params, token: app.token }
      return files.delete(params)
    },
    filesInfo(params?: Files.Info.Params) {
      params = { ...params, token: app.token }
      return files.info(params)
    },
    filesList(params?: Files.List.Params) {
      params = { ...params, token: app.token }
      return files.list(params)
    },
    filesRevokePublicURL(params?: Files.RevokePublicURL.Params) {
      params = { ...params, token: app.token }
      return files.revokePublicURL(params)
    },
    filesSharedPublicURL(params?: Files.SharedPublicURL.Params) {
      params = { ...params, token: app.token }
      return files.sharedPublicURL(params)
    },
    filesUpload(params?: Files.Upload.Params) {
      params = { ...params, token: app.token }
      return files.upload(params)
    },
    groupsArchive(params?: Groups.Archive.Params) {
      params = { ...params, token: app.token }
      return groups.archive(params)
    },
    groupsCreate(params?: Groups.Create.Params) {
      params = { ...params, token: app.token }
      return groups.create(params)
    },
    groupsCreateChild(params?: Groups.CreateChild.Params) {
      params = { ...params, token: app.token }
      return groups.createChild(params)
    },
    groupsHistory(params?: Groups.History.Params) {
      params = { ...params, token: app.token }
      return groups.history(params)
    },
    groupsInfo(params?: Groups.Info.Params) {
      params = { ...params, token: app.token }
      return groups.info(params)
    },
    groupsInvite(params?: Groups.Invite.Params) {
      params = { ...params, token: app.token }
      return groups.invite(params)
    },
    groupsKick(params?: Groups.Kick.Params) {
      params = { ...params, token: app.token }
      return groups.kick(params)
    },
    groupsLeave(params?: Groups.Leave.Params) {
      params = { ...params, token: app.token }
      return groups.leave(params)
    },
    groupsList(params?: Groups.List.Params) {
      params = { ...params, token: app.token }
      return groups.list(params)
    },
    groupsMark(params?: Groups.Mark.Params) {
      params = { ...params, token: app.token }
      return groups.mark(params)
    },
    groupsOpen(params?: Groups.Open.Params) {
      params = { ...params, token: app.token }
      return groups.open(params)
    },
    groupsRename(params?: Groups.Rename.Params) {
      params = { ...params, token: app.token }
      return groups.rename(params)
    },
    groupsReplies(params?: Groups.Replies.Params) {
      params = { ...params, token: app.token }
      return groups.replies(params)
    },
    groupsSetPurpose(params?: Groups.SetPurpose.Params) {
      params = { ...params, token: app.token }
      return groups.setPurpose(params)
    },
    groupsSetTopic(params?: Groups.SetTopic.Params) {
      params = { ...params, token: app.token }
      return groups.setTopic(params)
    },
    groupsUnarchive(params?: Groups.Unarchive.Params) {
      params = { ...params, token: app.token }
      return groups.unarchive(params)
    },
    imClose(params?: Im.Close.Params) {
      params = { ...params, token: app.token }
      return im.close(params)
    },
    imHistory(params?: Im.History.Params) {
      params = { ...params, token: app.token }
      return im.history(params)
    },
    imList(params?: Im.List.Params) {
      params = { ...params, token: app.token }
      return im.list(params)
    },
    imMark(params?: Im.Mark.Params) {
      params = { ...params, token: app.token }
      return im.mark(params)
    },
    imOpen(params?: Im.Open.Params) {
      params = { ...params, token: app.token }
      return im.open(params)
    },
    imReplies(params?: Im.Replies.Params) {
      params = { ...params, token: app.token }
      return im.replies(params)
    },
    migrationExchange(params?: Migration.Exchange.Params) {
      params = { ...params, token: app.token }
      return migration.exchange(params)
    },
    mpimClose(params?: Mpim.Close.Params) {
      params = { ...params, token: app.token }
      return mpim.close(params)
    },
    mpimHistory(params?: Mpim.History.Params) {
      params = { ...params, token: app.token }
      return mpim.history(params)
    },
    mpimList(params?: Mpim.List.Params) {
      params = { ...params, token: app.token }
      return mpim.list(params)
    },
    mpimMark(params?: Mpim.Mark.Params) {
      params = { ...params, token: app.token }
      return mpim.mark(params)
    },
    mpimOpen(params?: Mpim.Open.Params) {
      params = { ...params, token: app.token }
      return mpim.open(params)
    },
    mpimReplies(params?: Mpim.Replies.Params) {
      params = { ...params, token: app.token }
      return mpim.replies(params)
    },
    oauthAccess(params?: Oauth.Access.Params) {
      params = { ...params, token: app.token }
      return oauth.access(params)
    },
    oauthToken(params?: Oauth.Token.Params) {
      params = { ...params, token: app.token }
      return oauth.token(params)
    },
    pinsAdd(params?: Pins.Add.Params) {
      params = { ...params, token: app.token }
      return pins.add(params)
    },
    pinsList(params?: Pins.List.Params) {
      params = { ...params, token: app.token }
      return pins.list(params)
    },
    pinsRemove(params?: Pins.Remove.Params) {
      params = { ...params, token: app.token }
      return pins.remove(params)
    },
    reactionsAdd(params?: Reactions.Add.Params) {
      params = { ...params, token: app.token }
      return reactions.add(params)
    },
    reactionsGet(params?: Reactions.Get.Params) {
      params = { ...params, token: app.token }
      return reactions.get(params)
    },
    reactionsList(params?: Reactions.List.Params) {
      params = { ...params, token: app.token }
      return reactions.list(params)
    },
    reactionsRemove(params?: Reactions.Remove.Params) {
      params = { ...params, token: app.token }
      return reactions.remove(params)
    },
    remindersAdd(params?: Reminders.Add.Params) {
      params = { ...params, token: app.token }
      return reminders.add(params)
    },
    remindersComplete(params?: Reminders.Complete.Params) {
      params = { ...params, token: app.token }
      return reminders.complete(params)
    },
    remindersDelete(params?: Reminders.Delete.Params) {
      params = { ...params, token: app.token }
      return reminders.delete(params)
    },
    remindersInfo(params?: Reminders.Info.Params) {
      params = { ...params, token: app.token }
      return reminders.info(params)
    },
    remindersList(params?: Reminders.List.Params) {
      params = { ...params, token: app.token }
      return reminders.list(params)
    },
    rtmConnect(params?: Rtm.Connect.Params) {
      params = { ...params, token: app.token }
      return rtm.connect(params)
    },
    rtmStart(params?: Rtm.Start.Params) {
      params = { ...params, token: app.token }
      return rtm.start(params)
    },
    searchAll(params?: Search.All.Params) {
      params = { ...params, token: app.token }
      return search.all(params)
    },
    searchFiles(params?: Search.Files.Params) {
      params = { ...params, token: app.token }
      return search.files(params)
    },
    searchMessages(params?: Search.Messages.Params) {
      params = { ...params, token: app.token }
      return search.messages(params)
    },
    starsAdd(params?: Stars.Add.Params) {
      params = { ...params, token: app.token }
      return stars.add(params)
    },
    starsList(params?: Stars.List.Params) {
      params = { ...params, token: app.token }
      return stars.list(params)
    },
    starsRemove(params?: Stars.Remove.Params) {
      params = { ...params, token: app.token }
      return stars.remove(params)
    },
    teamAccessLogs(params?: Team.AccessLogs.Params) {
      params = { ...params, token: app.token }
      return team.accessLogs(params)
    },
    teamBillableInfo(params?: Team.BillableInfo.Params) {
      params = { ...params, token: app.token }
      return team.billableInfo(params)
    },
    teamInfo(params?: Team.Info.Params) {
      params = { ...params, token: app.token }
      return team.info(params)
    },
    teamIntegrationLogs(params?: Team.IntegrationLogs.Params) {
      params = { ...params, token: app.token }
      return team.integrationLogs(params)
    },
    teamProfileGet(params?: Team.Profile.Get.Params) {
      params = { ...params, token: app.token }
      return team.profile.get(params)
    },
    usergroupsCreate(params?: Usergroups.Create.Params) {
      params = { ...params, token: app.token }
      return usergroups.create(params)
    },
    usergroupsDisable(params?: Usergroups.Disable.Params) {
      params = { ...params, token: app.token }
      return usergroups.disable(params)
    },
    usergroupsEnable(params?: Usergroups.Enable.Params) {
      params = { ...params, token: app.token }
      return usergroups.enable(params)
    },
    usergroupsList(params?: Usergroups.List.Params) {
      params = { ...params, token: app.token }
      return usergroups.list(params)
    },
    usergroupsUpdate(params?: Usergroups.Update.Params) {
      params = { ...params, token: app.token }
      return usergroups.update(params)
    },
    usergroupsUsersList(params?: Usergroups.Users.List.Params) {
      params = { ...params, token: app.token }
      return usergroups.users.list(params)
    },
    usergroupsUsersUpdate(params?: Usergroups.Users.Update.Params) {
      params = { ...params, token: app.token }
      return usergroups.users.update(params)
    },
    usersConversations(params?: Users.Conversations.Params) {
      params = { ...params, token: app.token }
      return users.conversations(params)
    },
    usersDeletePhoto(params?: Users.DeletePhoto.Params) {
      params = { ...params, token: app.token }
      return users.deletePhoto(params)
    },
    usersGetPresence(params?: Users.GetPresence.Params) {
      params = { ...params, token: app.token }
      return users.getPresence(params)
    },
    usersIdentity(params?: Users.Identity.Params) {
      params = { ...params, token: app.token }
      return users.identity(params)
    },
    usersInfo(params?: Users.Info.Params) {
      params = { ...params, token: app.token }
      return users.info(params)
    },
    usersList(params?: Users.List.Params) {
      params = { ...params, token: app.token }
      return users.list(params)
    },
    usersLookupByEmail(params?: Users.LookupByEmail.Params) {
      params = { ...params, token: app.token }
      return users.lookupByEmail(params)
    },
    usersProfileGet(params?: Users.Profile.Get.Params) {
      params = { ...params, token: app.token }
      return users.profile.get(params)
    },
    usersProfileSet(params?: Users.Profile.Set.Params) {
      params = { ...params, token: app.token }
      return users.profile.set(params)
    },
    usersSetActive(params?: Users.SetActive.Params) {
      params = { ...params, token: app.token }
      return users.setActive(params)
    },
    usersSetPhoto(params?: Users.SetPhoto.Params) {
      params = { ...params, token: app.token }
      return users.setPhoto(params)
    },
    usersSetPresence(params?: Users.SetPresence.Params) {
      params = { ...params, token: app.token }
      return users.setPresence(params)
    },
  }
}
