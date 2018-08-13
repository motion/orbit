import { channels, chat, users } from 'slack'
import { SlackChannel, SlackMessage, SlackUser } from './SlackTypes'
import { SettingEntity } from '../../entities/SettingEntity'

/**
 * Loads the data from the Slack API.
 */
export class SlackLoader {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  /**
   * Loads all slack users.
   *
   * @see https://api.slack.com/methods/users.list
   */
  async loadUsers(cursor?: string): Promise<SlackUser[]> {
    const response = await users.list({
      token: this.setting.token,
      limit: 1000,
      cursor: cursor,
    })
    const nextPageCursor =
      response.response_metadata && response.response_metadata.next_cursor
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
    const response = await channels.list({
      token: this.setting.token,
      cursor: cursor,
    })

    const nextPageCursor =
      response.response_metadata && response.response_metadata.next_cursor
    if (nextPageCursor) {
      const nextPageChannels = await this.loadChannels(nextPageCursor)
      return [...nextPageChannels, ...response.channels]
    }

    return response.channels
  }

  /**
   * Loads all slack messages.
   *
   * @see https://api.slack.com/methods/channels.history
   */
  async loadMessages(
    channelId: string,
    oldestMessageId?: string,
  ): Promise<SlackMessage[]> {
    const response = await channels.history({
      token: this.setting.token,
      channel: channelId,
      count: 1000,
      oldest: oldestMessageId,
    })

    if (response.has_more === true) {
      const oldest = response.messages[response.messages.length - 1]
      const nextPageMessages = await this.loadMessages(channelId, oldest)
      return [...nextPageMessages, ...response.messages]
    }

    return response.messages
  }

}
