import { Logger } from '@mcro/logger'
import { sleep } from '@mcro/sync-kit'
import { channels, team, users } from 'slack'
import { SlackChannel, SlackMessage, SlackTeam, SlackUser } from './SlackModels'
import { AppBit } from '@mcro/models'

/**
 * Defines a loading throttling.
 * This is required to not overload user network with service queries.
 */
const THROTTLING = {

  /**
   * Delay before users load.
   */
  users: 100,

  /**
   * Delay before channels load.
   */
  channels: 100,

  /**
   * Delay before messages load.
   */
  messages: 100

}

/**
 * Loads the data from the Slack API.
 */
export class SlackLoader {
  private app: AppBit
  private log: Logger

  constructor(app: AppBit, log?: Logger) {
    this.app = app
    this.log = log || new Logger('service:slack:loader:' + app.id)
  }

  /**
   * Loads slack team info.
   *
   * @see https://api.slack.com/methods/team.info
   */
  async loadTeam(): Promise<SlackTeam> {
    this.log.vtimer('load team info from API')
    const options = { token: this.app.token }
    this.log.verbose('request to team.info', options)
    const response = await team.info(options)
    this.log.vtimer('load team info from API', response.team)
    return response.team
  }

  /**
   * Loads all slack users.
   *
   * @see https://api.slack.com/methods/users.list
   */
  async loadUsers(): Promise<SlackUser[]> {
    const loadRecursively = async (cursor?: string) => {
      await sleep(THROTTLING.users)

      const options = {
        token: this.app.token,
        limit: 1000,
        cursor: cursor,
      }
      this.log.verbose('request to users.list', options)
      const response = await users.list(options)

      const nextPageCursor = response.response_metadata && response.response_metadata.next_cursor
      if (nextPageCursor) {
        const nextPageUsers = await loadRecursively(nextPageCursor)
        return [...nextPageUsers, ...response.members]
      }

      return response.members
    }

    this.log.timer('load API users')
    const members = await loadRecursively()
    this.log.timer('load API users', members)

    // filter out bots and strange users without emails
    const filteredMembers = members.filter(member => {
      return member.is_bot === false && member.profile.email
    })
    this.log.info('filtered API users (non bots)', filteredMembers)

    return filteredMembers
  }

  /**
   * Loads all slack channels.
   *
   * @see https://api.slack.com/methods/channels.list
   */
  async loadChannels(): Promise<SlackChannel[]> {
    const recursiveLoad = async (cursor?: string) => {
      await sleep(THROTTLING.channels)

      const options = {
        token: this.app.token,
        cursor: cursor,
      }
      this.log.verbose('request to channels.list', options)
      const response = await channels.list(options)

      const nextPageCursor = response.response_metadata && response.response_metadata.next_cursor
      if (nextPageCursor) {
        const nextPageChannels = await recursiveLoad(nextPageCursor)
        return [...nextPageChannels, ...response.channels]
      }

      return response.channels
    }

    this.log.timer('load API channels')
    const loadedChannels = await recursiveLoad()
    this.log.timer('load API channels', loadedChannels)
    return loadedChannels
  }

  /**
   * Loads all slack messages.
   *
   * Loading messages is very tricky.
   * In the case if you load all messages for the first time,
   * you'll need to get all messages and organize pagination using "latest" message id.
   * But if you use "oldest message id" which gives you messages after that oldest message,
   * you can't use "latest" message id - it will give you wrong results now.
   * Now you need continue to use "oldest" to get all paginated new messages.
   *
   * @see https://api.slack.com/methods/channels.history
   */
  async loadMessages(
    channel: SlackChannel,
    oldestMessageId?: string,
  ): Promise<{ messages: SlackMessage[], lastMessageTz: string }> {
    const loadRecursively = async (
      oldestMessageId?: string,
      latestMessageId?: string
    ) => {
      await sleep(THROTTLING.messages)

      const options = {
        token: this.app.token,
        channel: channel.id,
        count: 1000,
        oldest: oldestMessageId,
        latest: latestMessageId,
      }
      this.log.verbose('request to channels.history', options)
      const response = await channels.history(options)

      if (response.has_more === true) {
        const latest = response.messages[0].ts
        const oldest = response.messages[response.messages.length - 1].ts
        if (oldestMessageId) {
          const nextPageMessages = await loadRecursively(latest, undefined) // variable order isn't a typo!
          return [...nextPageMessages, ...response.messages]
        } else {
          const nextPageMessages = await loadRecursively(undefined, oldest) // variable order isn't a typo!
          return [...response.messages, ...nextPageMessages]
        }
      }

      return response.messages
    }

    // load messages
    this.log.timer(`loading ${channel.name}(#${channel.id}) API messages`, { oldestMessageId })
    const messages = await loadRecursively()
    this.log.timer(`loading ${channel.name}(#${channel.id}) API messages`, messages)

    // left only messages we need - real user messages, no system or bot messages
    const filteredMessages = messages.filter(message => {
      return message.type === 'message' && !message.subtype && !message.bot_id && message.user
    })
    this.log.info('filtered messages (no bots and others)', filteredMessages)

    return {
      messages: filteredMessages,
      lastMessageTz: messages[0].ts // note: we must use loaded messages, not filtered
    }
  }
}
