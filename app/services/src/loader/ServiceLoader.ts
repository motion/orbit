import { Logger } from '@mcro/logger'
import { Source, DriveSource, GmailSource } from '@mcro/models'
import * as fs from 'fs'
import * as https from 'https'
import { URL } from 'url'
import {
  ServiceLoaderDownloadFileOptions,
  ServiceLoaderKeyValue,
  ServiceLoaderLoadOptions,
  ServiceLoaderSourceSaveCallback,
} from './ServiceLoaderTypes'

/**
 * Loader (fetcher) from service.
 */
export class ServiceLoader {
  private source: Source
  private log: Logger
  private baseUrl: string
  private headers: ServiceLoaderKeyValue
  private saveCallback?: ServiceLoaderSourceSaveCallback

  constructor(
    source: Source,
    log: Logger,
    baseUrl?: string,
    headers?: ServiceLoaderKeyValue,
    saveCallback?: ServiceLoaderSourceSaveCallback,
  ) {
    this.source = source
    this.log = log
    this.baseUrl = baseUrl || ''
    this.headers = headers || {}
    this.saveCallback = saveCallback
  }

  /**
   * Performs HTTP request to the atlassian to get requested data.
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

    // execute query
    this.log.vtimer(`request to ${url}`, headers)
    const result = await fetch(url, {
      mode: options.cors ? 'cors' : undefined,
      method: options.method || 'get',
      body: options.body || undefined,
      headers,
    })
    const responseBody: any = options.plain ? await result.text() : await result.json()
    this.log.vtimer(`request to ${url}`, { response: result, body: responseBody })

    // throw error if there is an error
    if (!result.ok || responseBody.error || responseBody.errors) {
      if (
        (this.source.type === 'gmail' || this.source.type === 'drive') &&
        autoRefreshTokens === true &&
        result.status === 401
      ) {
        this.log.warning('refreshing oauth token')
        await this.refreshGoogleToken(this.source as GmailSource | DriveSource)
        return this.load(options, false)
      }
      const error = typeof responseBody === 'object' ? JSON.stringify(responseBody) : responseBody
      throw new Error(`[${result.status}] ${result.statusText}: ${error}`)
    }

    return responseBody
  }

  /**
   * Downloads given file.
   */
  downloadFile(options: ServiceLoaderDownloadFileOptions): Promise<void> {
    // prepare data
    const qs = this.queryObjectToQueryString(options.query)
    const url = `${this.baseUrl}${options.path}${qs}`
    const headers = {
      ...this.headers,
      ...(options.headers || {}),
    }

    return new Promise((ok, fail) => {
      try {
        const file = fs.createWriteStream(options.destination)
        const urlObject = new URL(url)
        https.get(
          {
            protocol: urlObject.protocol,
            host: urlObject.host,
            port: urlObject.port,
            path: urlObject.pathname,
            method: 'GET',
            headers,
          },
          function(response) {
            response.pipe(file)
            file
              .on('finish', function() {
                file.close()
                ok()
              })
              .on('error', function(err) {
                // Handle errors
                fail(err.message)
              })
          },
        )
      } catch (err) {
        fail(err)
      }
    })
  }

  /**
   * Refreshes Google API token.
   */
  private async refreshGoogleToken(source: GmailSource | DriveSource) {
    // check if we have credentials defined
    if (!source.values.oauth)
      throw new Error(`OAuth values are not defined in the given source (#${source.id})`)

    if (!source.values.oauth.refreshToken)
      throw new Error(`Refresh token is not set in the given source (#${source.id})`)

    // setup a data we are going to send
    const formData = {
      refresh_token: source.values.oauth.refreshToken,
      client_id: source.values.oauth.clientId,
      client_secret: source.values.oauth.secret,
      grant_type: 'refresh_token',
    }
    const body = Object.keys(formData)
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
    if (reply.error) throw reply.error

    if (!reply.access_token) throw new Error('No access token was found in refresh token response')

    // update tokens in the source
    source.token = reply.access_token
    if (reply.refresh_token) {
      source.values.oauth.refreshToken = reply.refresh_token
    }

    // execute save callback if defined
    // we use save callback instead of direct save because our services package is cross-platform
    if (this.saveCallback) {
      await this.saveCallback(source)
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
