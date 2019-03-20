import * as fs from 'fs'
import * as https from 'https'
import { URL } from 'url'

/**
 * Common type for key-value values like headers, query parameters, etc.
 */
export type ServiceLoaderKeyValue = { [key: string]: any }

/**
 * Options for service loader's downloadFile method.
 */
export interface ServiceLoaderDownloadFileOptions<_T = any> {
  /**
   * Destination path where file should be written into.
   */
  destination: string

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
}

/**
 * Downloads files from the service.
 */
export class FileDownloader {
  private baseUrl: string
  private headers?: { [name: string]: string }

  constructor(
    options: {
      baseUrl: string
      headers?: { [name: string]: string }
    },
  ) {
    this.baseUrl = options.baseUrl
    this.headers = options.headers
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
