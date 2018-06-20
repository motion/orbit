export type DriveServiceHelpers = {
  baseUrl: string
  refreshToken: () => Promise<boolean>
  fetch(path: string, options?: FetchOptions): Promise<any>
}

export type FetchOptions =
  | undefined
  | {
      isRetrying?: boolean
      type?: string
      mode?: string
      query?: Object
      headers?: Object
      body?: Object
    }
