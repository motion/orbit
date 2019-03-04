import { AppEntity, Bit } from '@mcro/models'
import { BitUtils, createSyncer } from '@mcro/sync-kit'
import { SlackBitData } from './SlackBitData'
import { SlackAttachment, SlackChannel, SlackMessage, SlackTeam, SlackUser } from './SlackTypes'
import { SlackLoader } from './SlackLoader'

/**
 * Syncs Slack messages.
 */
export const SlackSyncer = createSyncer(async ({ app, log, manager, utils, isAborted }) => {

  const Autolinker = require('autolinker')
  const appData = app.data
  const loader = new SlackLoader(app, log)

  /**
   * Filters given slack channels by channels in the apps.
   */
  const filterChannelsBySettings = (channels: SlackChannel[]) => {
    const values = appData.values
    const appChannels =
      values.channels /* || {
      'C0SAU3124': true,
      'CBV9PGSGG': true,
      'C316QRE1J': true,
      'C221Y7CMN': true,
    }*/

    // if no channels in apps are selected then return all channels
    if (!appChannels) return channels

    const appsChannelIds = Object.keys(appChannels).filter(key => appChannels[key])

    return channels.filter(channel => {
      return appsChannelIds.indexOf(channel.id) !== -1
    })
  }

  /**
   * Groups messages into "conversations".
   * Conversation is a group of messages left in specific period of time.
   */
  const createConversation = (messages: SlackMessage[]): SlackMessage[][] => {
    // push a first message as a first message in a first group
    const conversations: SlackMessage[][] = []
    for (const message of messages) {
      // push first message as a first group in a conversation
      if (message === messages[0]) {
        conversations.push([message])
        continue
      }

      const index1 = conversations.length - 1
      const index2 = conversations[index1].length - 1
      const lastMessageInGroup = conversations[index1][index2]
      const distanceInSeconds = Math.abs(+message.ts - +lastMessageInGroup.ts)
      const isSameConversation = distanceInSeconds < 60 * 4

      // if its the same conversation we just push another message
      // if its not then create a new conversation with current message
      if (isSameConversation) {
        conversations[index1].push(message)
      } else {
        conversations.push([message])
      }
    }
    return conversations
  }

  /**
   * Creates a single app person from given Slack user.
   */
  const createPersonBit = (user: SlackUser, team: SlackTeam): Bit => {
    return BitUtils.create(
      {
        appIdentifier: 'slack',
        appId: app.id,
        type: 'person',
        originalId: user.id,
        title: user.profile.real_name || user.name,
        webLink: `https://${team.domain}.slack.com/messages/${user.id}`,
        desktopLink: `slack://user?team=${team.id}&id=${user.id}`,
        email: user.profile.email,
        photo: user.profile.image_512,
        data: {
          tz: user.tz,
          team: user.id,
        },
      },
      user.id,
    )
  }

  /**
   * Creates a new slack conversation bit.
   */
  const createConversationBit = (channel: SlackChannel, messages: SlackMessage[], allPeople: Bit[]): Bit => {
    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here

    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const bitCreatedAt = +firstMessage.ts.split('.')[0] * 1000
    const bitUpdatedAt = +lastMessage.ts.split('.')[0] * 1000
    const webLink = `https://${appData.values.team.domain}.slack.com/archives/${
      channel.id
      }/p${firstMessage.ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${firstMessage.ts}&team=${
      appData.values.team.id
      }`
    const mentionedPeople = findMessageMentionedPeople(messages, allPeople)
    const data: SlackBitData = {
      messages: messages.reverse().map(message => ({
        user: message.user,
        text: buildSlackText(message.text, allPeople),
        time: +message.ts.split('.')[0] * 1000,
      })),
    }
    const people = allPeople.filter(person => {
      return (
        messages.some(message => {
          return message.user === person.originalId
        }) ||
        mentionedPeople.some(mentionedPerson => {
          return person.id === mentionedPerson.id
        })
      )
    })

    return BitUtils.create(
      {
        appId: app.id,
        appIdentifier: 'slack',
        type: 'conversation',
        title: '',
        body: data.messages.map(message => message.text).join(' ... '),
        data,
        bitCreatedAt,
        bitUpdatedAt,
        people,
        location: {
          id: channel.id,
          name: channel.name,
          webLink: `https://${appData.values.team.domain}.slack.com/archives/${channel.id}`,
          desktopLink: `slack://channel?id=${channel.id}&team=${appData.values.team.id}`,
        },
        webLink,
        desktopLink,
      },
      channel.id + '_' + firstMessage.ts,
    )
  }

  /**
   * Creates a new slack website bit.
   */
  const createWebsiteBit = (
    channel: SlackChannel,
    message: SlackMessage,
    attachment: SlackAttachment,
    allPeople: Bit[],
): Bit => {
    const messageTime = +message.ts.split('.')[0] * 1000
    const mentionedPeople = findMessageMentionedPeople([message], allPeople)
    const people = allPeople.filter(person => {
      return (
        message.user === person.originalId ||
        mentionedPeople.some(mentionedPerson => person.id === mentionedPerson.id)
      )
    })

    return BitUtils.create(
      {
        appId: app.id,
        appIdentifier: 'slack',
        type: 'website',
        title: attachment.title,
        body: attachment.text,
        data: {
          url: attachment.original_url,
          title: attachment.title,
          content: '',
        },
        bitCreatedAt: messageTime,
        bitUpdatedAt: messageTime,
        people,
        location: {
          id: channel.id,
          name: channel.name,
          webLink: `https://${appData.values.team.domain}.slack.com/archives/${channel.id}`,
          desktopLink: `slack://channel?id=${channel.id}&team=${appData.values.team.id}`,
        },
        webLink: attachment.original_url,
        desktopLink: undefined,
      },
      channel.id + '_' + message.ts + '_' + attachment.id,
    )
  }

  /**
   * Processes text for a slack message
   */
  const buildSlackText = (message: string, people: Bit[]): string => {
    // merge all messages texts into a single body
    let body = message.trim()
    // replace all people id mentions in the message into a real people names
    for (let bit of people) {
      body = body.replace(new RegExp(`<@${bit.originalId}>`, 'g'), '@' + bit.title)
    }
    // make all links in the message a better formatting (without http and <>)
    const matchedLinks: string[] = []
    body = Autolinker.link(body, {
      replaceFn: match => {
        matchedLinks.push(match.getAnchorText())
        return match.getAnchorText()
      },
    })
    for (let matchedLink of matchedLinks) {
      body = body.replace(`<${matchedLink}>`, matchedLink)
    }
    return body
  }

  /**
   * Finds all the mentioned people in the given slack messages.
   */
  const findMessageMentionedPeople = (messages: SlackMessage[], people: Bit[]) => {
    const body = messages.map(message => message.text).join('')
    return people.filter(person => new RegExp(`<@${person.originalId}>`).test(body))
  }

  // load team info
  log.timer('load team info from API')
  const team = await loader.loadTeam()
  log.timer('load team info from API')

  // update apps with team info
  const values = appData.values
  values.team = {
    id: team.id,
    name: team.name,
    domain: team.domain,
    icon: team.icon.image_132,
  }
  await manager.getRepository(AppEntity).save(app)

  // load api users
  log.timer('load API users')
  const apiUsers = await loader.loadUsers()
  log.timer('load API users', apiUsers.length)

  // filter out bots and strange users without emails
  const filteredApiUsers = apiUsers.filter(user => {
    return user.is_bot === false && user.profile.email
  })
  log.info('filtered API users (non bots)', filteredApiUsers)

  // creating entities for them
  log.info('finding and creating people for users', filteredApiUsers)
  const apiPeople = filteredApiUsers.map(user => {
    return createPersonBit(user, team)
  })

  // load all people and person bits from the local database
  log.timer('load synced people and person bits from the database')
  const dbPeople = await utils.loadDatabasePeople()
  log.timer('load synced people and person bits from the database', { dbPeople })

  // sync people
  await utils.syncPeople(apiPeople, dbPeople)

  // re-load database people, we need them to deal with bits
  log.timer('load synced people from the database')
  const allDbPeople = await utils.loadDatabasePeople()
  log.timer('load synced people from the database', allDbPeople)

  // load all slack channels
  log.timer('load API channels')
  const allChannels = await loader.loadChannels()
  log.timer('load API channels', allChannels)

  // filter out channels based on user apps
  const activeChannels = filterChannelsBySettings(allChannels)
  log.info('filtering only selected channels', activeChannels)

  // go through all channels
  const lastMessageSync = values.lastMessageSync || {}

  for (let channel of activeChannels) {
    await isAborted()

    // to load messages using pagination we use "oldest" message we got last time when we synced
    // BUT we also need to support edit and remove last x messages
    // (since we can't have up-to-date edit and remove of all messages)
    const oldestMessageId = lastMessageSync[channel.id]
      ? String(parseInt(lastMessageSync[channel.id]) + 1 /* - 60 * 60 * 24*/)
      : undefined

    // we need to load all bits in the data range period we are working with (oldestMessageId)
    // because we do comparision and update bits, also we remove removed messages
    log.timer(`loading ${channel.name}(#${channel.id}) database bits`, { oldestMessageId })
    const dbBits = await utils.loadDatabaseBits({
      locationId: channel.id,
      oldestMessageId,
    })
    log.timer(`loading ${channel.name}(#${channel.id}) database bits`, dbBits)

    // load messages
    log.timer(`loading ${channel.name}(#${channel.id}) API messages`, { oldestMessageId })
    const loadedMessages = await loader.loadMessages(channel.id, oldestMessageId)
    log.timer(`loading ${channel.name}(#${channel.id}) API messages`, loadedMessages)

    // sync messages if we found them
    if (loadedMessages.length) {
      // left only messages we need - real user messages, no system or bot messages
      const filteredMessages = loadedMessages.filter(message => {
        return message.type === 'message' && !message.subtype && !message.bot_id && message.user
      })
      log.info('filtered messages (no bots and others)', filteredMessages)

      // group messages into special "conversations" to avoid insertion of multiple bits for each message
      const conversations = createConversation(filteredMessages)
      log.info(`created conversations: ${conversations.length}`, conversations)

      // create bits from conversations
      const apiBits = conversations.map(messages =>
        createConversationBit(channel, messages, allDbPeople),
      )

      // create bits from links inside messages
      for (let message of filteredMessages) {
        if (!message.attachments || !message.attachments.length) continue

        for (let attachment of message.attachments) {
          if (attachment.title && attachment.text && attachment.original_url) {
            apiBits.push(createWebsiteBit(channel, message, attachment, allDbPeople))
          }
        }
      }
      log.info(`bits were created: ${apiBits.length}`, apiBits)

      // sync all the bits we have
      await utils.syncBits({
        apiBits,
        dbBits,
        completeBitsData: async bits => {
          for (let bit of bits) {
            const flatBody = (bit.data as SlackBitData).messages.map(x => x.text).join(' ')
            bit.title = (await utils.loadTextTopWords(flatBody, 6)).join(' ')
          }
        }
      })

      // update last message sync app
      // note: we need to use loaded messages, not filtered
      lastMessageSync[channel.id] = loadedMessages[0].ts

      // update apps
      log.info('update apps', { lastMessageSync })
      values.lastMessageSync = lastMessageSync
      await manager.getRepository(AppEntity).save(app)
    }
  }

})
