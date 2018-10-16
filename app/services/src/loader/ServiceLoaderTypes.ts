import { Setting } from '@mcro/models'

/**
 * Callback to be executed to save a setting.
 */
export type ServiceLoaderSettingSaveCallback = (setting: Setting) => any

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

}

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
