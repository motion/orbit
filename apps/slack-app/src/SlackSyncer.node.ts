import { SlackBitFactory } from './SlackBitFactory'
import { SlackLoader } from './SlackLoader'
import { SlackAppData, SlackBitData } from './SlackModels'
import { createConversation, filterChannelsBySettings } from './SlackUtils'
import { AppWorker } from '@o/models'

/**
 * Syncs Slack messages.
 */
export const SlackSyncer: AppWorker = async ({ app, log, utils }) => {
  const appData: SlackAppData = app.data
  const loader = new SlackLoader(app, log)
  const factory = new SlackBitFactory(app, utils)

  // load team info and update app data with team info
  const team = await loader.loadTeam()
  appData.values.team = {
    id: team.id,
    name: team.name,
    domain: team.domain,
    icon: team.icon.image_132,
  }
  await utils.updateAppData()

  // load api users and create person bits for them
  const apiUsers = await loader.loadUsers()
  const apiPeople = apiUsers.map(user => factory.createPersonBit(user, team))

  // load database people and execute sync. once sync is complete we must re-load people
  const dbPeople = await utils.loadBits({ type: 'person' })
  await utils.syncBits(apiPeople, dbPeople)
  const allDbPeople = await utils.loadBits({ type: 'person' })

  // load all slack channels
  const allChannels = await loader.loadChannels()

  // filter out channels based on user apps
  const activeChannels = filterChannelsBySettings(appData, allChannels)
  log.info('filtering only selected channels', activeChannels)

  // go through all channels
  const lastMessageSync = appData.values.lastMessageSync || {}

  for (let channel of activeChannels) {
    await utils.isAborted()

    // to load messages using pagination we use "oldest" message we got last time when we synced
    // BUT we also need to support edit and remove last x messages
    // (since we can't have up-to-date edit and remove of all messages)
    const oldestMessageId = lastMessageSync[channel.id]
      ? String(parseInt(lastMessageSync[channel.id]) + 1 /* - 60 * 60 * 24*/)
      : undefined

    // we need to load all bits in the data range period we are working with (oldestMessageId)
    // because we do comparision and update bits, also we remove removed messages
    const dbBits = await utils.loadBits({
      idsOnly: true,
      locationId: channel.id,
      bitCreatedAtMoreThan: oldestMessageId ? parseInt(oldestMessageId) * 1000 : undefined,
    })

    // load messages
    const { messages, lastMessageTz } = await loader.loadMessages(channel.id, oldestMessageId)

    // sync messages if we found them
    if (messages.length && lastMessageTz) {
      // group messages into special "conversations" to avoid insertion of multiple bits for each message
      const conversations = createConversation(messages)
      log.info(`created conversations: ${conversations.length}`, conversations)

      // create bits from conversations
      const apiBits = conversations.map(messages =>
        factory.createConversationBit(channel, messages, allDbPeople),
      )

      // create bits from links inside messages
      for (let message of messages) {
        if (message.attachments && message.attachments.length) {
          for (let attachment of message.attachments) {
            if (attachment.title && attachment.text && attachment.original_url) {
              apiBits.push(factory.createWebsiteBit(channel, message, attachment, allDbPeople))
            }
          }
        }
      }
      log.info(`${apiBits.length} bits were created from conversations and websites`, apiBits)

      // sync all the bits we have
      await utils.syncBits(apiBits, dbBits, {
        completeBitsData: async bits => {
          for (let bit of bits) {
            if ((bit.data as SlackBitData).messages) {
              const flatBody = (bit.data as SlackBitData).messages.map(x => x.text).join(' ')
              bit.title = (await utils.loadTextTopWords(flatBody, 6)).join(' ')
            }
          }
        },
      })

      // update last message sync app
      lastMessageSync[channel.id] = lastMessageTz
      appData.values.lastMessageSync = lastMessageSync
      await utils.updateAppData()
    }
  }
}
