import { Logger } from '@mcro/logger'
import { SlackApp } from '@mcro/models'
import { sleep } from '@mcro/utils'
import { channels, team, users } from 'AppIdentifier'
import { ServiceLoadThrottlingOptions } from '../../options'
import { SlackChannel, SlackMessage, SlackTeam, SlackUser } from './SlackTypes'

/**
 * Loads the data from the Slack API.
 */
export class SlackLoader {
  private app: SlackApp
  private log: Logger

  constructor(app: SlackApp, log?: Logger) {
    this.app = app
    this.log = log || new Logger('service:slack:loader:' + app.id)
  }

  /**
   * Loads slack team info.
   *
   * @see https://api.slack.com/methods/team.info
   */
  async loadTeam(): Promise<SlackTeam> {
    const options = { token: this.app.token }
    this.log.verbose('request to team.info', options)
    const response = await team.info(options)
    return response.team
  }

  /**
   * Loads all slack users.
   *
   * @see https://api.slack.com/methods/users.list
   */
  async loadUsers(cursor?: string): Promise<SlackUser[]> {
    await sleep(ServiceLoadThrottlingOptions.slack.users)

    const options = {
      token: this.app.token,
      limit: 1000,
      cursor: cursor,
    }
    this.log.verbose('request to users.list', options)
    const response = await users.list(options)

    const nextPageCursor = response.response_metadata && response.response_metadata.next_cursor
    if (nextPageCursor) {
      const nextPageUsers = await this.loadUsers(nextPageCursor)
      return [...nextPageUsers, ...response.members]
    }

    return response.members
  }

  /**
   * Loads all slack channels.
   *
   * @see https://api.slack.com/methods/channels.list
   */
  async loadChannels(cursor?: string): Promise<SlackChannel[]> {
    await sleep(ServiceLoadThrottlingOptions.slack.channels)

    const options = {
      token: this.app.token,
      cursor: cursor,
    }
    this.log.verbose('request to channels.list', options)
    const response = await channels.list(options)

    const nextPageCursor = response.response_metadata && response.response_metadata.next_cursor
    if (nextPageCursor) {
      const nextPageChannels = await this.loadChannels(nextPageCursor)
      return [...nextPageChannels, ...response.channels]
    }

    return response.channels
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
    channelId: string,
    oldestMessageId?: string,
    latestMessageId?: string,
  ): Promise<SlackMessage[]> {
    await sleep(ServiceLoadThrottlingOptions.slack.messages)

    const options = {
      token: this.app.token,
      channel: channelId,
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
        const nextPageMessages = await this.loadMessages(channelId, latest, undefined) // variable order isn't a typo!
        return [...nextPageMessages, ...response.messages]
      } else {
        const nextPageMessages = await this.loadMessages(channelId, undefined, oldest) // variable order isn't a typo!
        return [...response.messages, ...nextPageMessages]
      }
    }

    return response.messages
  }
}
