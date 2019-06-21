import { Logger } from '@o/logger'
import { AppBit } from '@o/models'

/**
 * Callback to be executed to save a app.
 */
export type ServiceLoaderAppSaveCallback = (app: AppBit) => any

/**
 * Common type for key-value values like headers, query parameters, etc.
 */
export type ServiceLoaderKeyValue = { [key: string]: any }

/**
 * Options for service loader's load method.
 */
export interface ServiceLoaderLoadOptions<_T = any> {
  /**
   * Request url. Partial path can be specified in the case if basedUrl was defined in the service loader.
   */
  path: string

  /**
   * Request query params.
   */
  query?: ServiceLoaderKeyValue

  /**
   * Request headers.
   */
  headers?: ServiceLoaderKeyValue

  /**
   * Indicates if cors must be enabled.
   */
  cors?: boolean

  /**
   * Use plain text response instead of json.
   */
  plain?: boolean

  /**
   * Request method. GET by default.
   */
  method?: string

  /**
   * Request body.
   */
  body?: string
}


/**
 * Loader (fetcher) from service.
 */
export class ServiceLoader {
  private app: AppBit
  private log: Logger
  private saveCallback?: ServiceLoaderAppSaveCallback
  private baseUrl: string
  private headers?: { [name: string]: string }

  constructor(
    app: AppBit,
    log: Logger,
    options: {
      baseUrl: string
      headers?: { [name: string]: string }
      saveCallback?: ServiceLoaderAppSaveCallback
    },
  ) {
    this.app = app
    this.log = log
    this.baseUrl = options.baseUrl
    this.headers = options.headers
    this.saveCallback = options.saveCallback
  }

  /**
   * Performs HTTP request to the url to get requested data.
   */
  async load<T>(
    options: ServiceLoaderLoadOptions<T>,
    autoRefreshTokens: boolean = true,
  ): Promise<T> {
    // prepare data
    const qs = this.queryObjectToQueryString(options.query)
    const url = `${this.baseUrl}${options.path}${qs}`
    const headers: any = {
      ...this.headers,
      ...(options.headers || {}),
    }

    if (!options.plain) {
      headers['Content-Type'] = 'application/json'
    }

    const fetchOptions: any = {
      method: options.method || 'get',
      body: options.body || undefined,
      headers,
    }
    if (options.cors === true) {
      fetchOptions.mode = 'cors'
    }

    // execute query
    this.log.vtimer(`request to ${url}`)
    const result = await fetch(url, fetchOptions)
    const responseBody: any = options.plain ? await result.text() : await result.json()
    this.log.vtimer(`request to ${url}`, result)

    // throw error if there is an error
    if (!result.ok || responseBody.error || responseBody.errors) {
      if (
        (this.app.identifier === 'gmail' || this.app.identifier === 'drive') &&
        autoRefreshTokens === true &&
        result.status === 401
      ) {
        this.log.warning('refreshing oauth token')
        await this.refreshGoogleToken(this.app)
        return this.load(options, false)
      }
      const error = typeof responseBody === 'object' ? JSON.stringify(responseBody) : responseBody
      throw new Error(`[${result.status}] ${result.statusText}: ${error}`)
    }

    return responseBody
  }

  /**
   * Refreshes Google API token.
   *
   * todo: this is still integration-specific.
   */
  private async refreshGoogleToken(app: AppBit) {
    // check if we have credentials defined
    if (!app.data.values.oauth)
      throw new Error(`OAuth values are not defined in the given app (#${app.id})`)

    if (!app.data.values.oauth.refreshToken)
      throw new Error(`Refresh token is not set in the given app (#${app.id})`)

    // setup a data we are going to send
    const formData = {
      refresh_token: app.data.values.oauth.refreshToken,
      client_id: app.data.values.oauth.clientId,
      client_secret: app.data.values.oauth.secret,
      grant_type: 'refresh_token',
    }
    const body = Object.keys(formData)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(formData[k])}`)
      .join('&')

    // make a query
    this.log.info('refreshing oauth token', { formData, body })
    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      body,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    // get a response
    const reply = await response.json()
    if (reply.error) throw reply.error

    if (!reply.access_token) throw new Error('No access token was found in refresh token response')

    // update tokens in the app
    app.token = reply.access_token
    if (reply.refresh_token) {
      app.data.values.oauth.refreshToken = reply.refresh_token
    }

    // execute save callback if defined
    // we use save callback instead of direct save because our services package is cross-platform
    if (this.saveCallback) {
      await this.saveCallback(app)
    }

    return true
  }

  /**
   * Converts simple query object to a URL query string.
   * For example { a: "hello", b: "world" } getting converting into ?a=hello&b=world.
   * Skips undefined properties.
   */
  private queryObjectToQueryString(query: { [key: string]: any } | undefined): string {
    if (!query || !Object.keys(query).length) return ''

    return (
      '?' +
      Object.keys(query)
        .filter(key => query[key] !== undefined)
        .map(key => `${key}=${query[key]}`)
        .join('&')
    )
  }
}
