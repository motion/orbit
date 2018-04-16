export type SlackPerson = {
  id: string
  deleted: boolean
  is_app_user: boolean
  is_bot: boolean
  name: string
  team_id: string
  updated: number
  profile: {
    avatar_hash: string
    display_name: string
    display_name_normalized: string
    email: string
    first_name: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
    image_512: string
    last_name: string
    phone: string
    real_name: string
    real_name_normalized: string
    skype: string
    status_emoji: string
    status_expiration: number
    status_text: string
    team: string
    title: string
  }
}
