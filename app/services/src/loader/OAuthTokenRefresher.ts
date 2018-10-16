import { DriveSetting, GmailSetting } from '@mcro/models'

/**
 * Refreshes access token
 */
export class OAuthTokenRefresher {

  /**
   * Refreshes Google API token.
   */
  static async refreshGoogleToken(setting: GmailSetting|DriveSetting) {

    // check if we have credentials defined
    if (!setting.values.oauth)
      throw new Error(`OAuth values are not defined in the given setting (#${setting.id})`)

    if (!setting.values.oauth.refreshToken)
      throw new Error(`Refresh token is not set in the given setting (#${setting.id})`)

    // setup a data we are going to send
    const formData = {
      refresh_token: setting.values.oauth.refreshToken,
      client_id: setting.values.oauth.clientId,
      client_secret: setting.values.oauth.secret,
      grant_type: 'refresh_token',
    }
    const body = Object
      .keys(formData)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(formData[k])}`)
      .join('&')

    // make a query
    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      body,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    // get a response
    const reply = await response.json()
    if (reply.error)
      throw reply.error

    if (!reply.access_token)
      throw new Error(`No access token was found in refresh token response`)

    return reply.access_token
  }

}