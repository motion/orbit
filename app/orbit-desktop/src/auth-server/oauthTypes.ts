export type OauthValues = {
  token: string
  info: {
    id: string
    [key: string]: string
  }
  error?: string
  refreshToken?: string
}
