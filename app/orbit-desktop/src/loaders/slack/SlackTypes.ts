/**
 * Slack message.
 *
 * @see https://api.slack.com/methods/channels.history
 */
export type SlackMessage = {
  type: string
  subtype: string
  user: string
  text: string
  ts: string
  is_starred: boolean
  bot_id: string
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