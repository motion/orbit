export interface SlackPersonData {
  id: string
  name: string
  email: string
  phone: string
  profile?: {
    image_512?: string
    email: string
  }
  tz: string
}
