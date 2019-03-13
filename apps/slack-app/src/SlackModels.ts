
export interface SlackAppData {
  data: {
    channels: any[]
  }
  values: {
    whitelist: string[]
    oauth?: {
      refreshToken: string
      secret: string
      clientId: string
    }
    channels?: Array<string>
    lastAttachmentSync?: { [key: string]: string }
    lastMessageSync?: { [key: string]: string }
    team: {
      id: string
      name: string
      domain: string
      icon: string
    }
  }
}

export interface SlackBitData {
  messages: SlackBitDataMessage[]
}

export interface SlackBitDataMessage {
  user: string
  text: string
  time: number
}

/**
 * Slack channel.
 *
 * @see https://api.slack.com/types/channel
 */
export interface SlackChannel {
  id: string
  name: string
  is_channel: boolean
  created: number
  creator: string
  is_archived: boolean
  is_general: boolean
  name_normalized: string
  is_shared: boolean
  is_org_shared: boolean
  is_member: boolean
  is_private: boolean
  is_mpim: boolean
  members: string[]
  topic: {
    value: string
    creator: string
    last_set: number
  }
  purpose: {
    value: string
    creator: string
    last_set: number
  }
  previous_names: string[]
  num_members: number
}

/**
 * Slack's message attachment.
 */
export type SlackAttachment = {
  id: number
  title: string
  text: string
  original_url: string
}

/**
 * Slack message.
 *
 * @see https://api.slack.com/methods/channels.history
 */
export type SlackMessage = {
  attachments: SlackAttachment[]
  type: string
  subtype: string
  user: string
  text: string
  ts: string
  is_starred: boolean
  bot_id: string
}

/**
 * Slack team.
 *
 * @see https://api.slack.com/methods/team.info
 */
export type SlackTeam = {
  id: string
  name: string
  domain: string
  icon: {
    image_34: string
    image_44: string
    image_68: string
    image_88: string
    image_102: string
    image_132: string
    image_original: string
  }
}

/**
 * Slack user.
 *
 * @see https://api.slack.com/types/user
 */
export type SlackUser = {
  id: string
  team_id: string
  name: string
  deleted: boolean
  color: string
  real_name: string
  tz: string
  tz_label: string
  tz_offset: number
  profile: {
    first_name: string
    last_name: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
    image_512: string
    avatar_hash: string
    always_active: boolean
    real_name: string
    real_name_normalized: string
    email: string
  }
  is_admin: boolean
  is_owner: boolean
  is_primary_owner: boolean
  is_restricted: boolean
  is_ultra_restricted: boolean
  is_bot: boolean
  updated: number
}
