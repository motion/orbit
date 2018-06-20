export type DriveServiceHelpers = {
  baseUrl: string
  refreshToken: () => Promise<boolean>
  fetch(
    path: string,
    options?: FetchOptions,
  ): Promise<{
    startPageToken?: string
    revisions?: Array<{ [id: string]: string }>
    newStartPageToken?: number
    nextPageToken?: string
    files?: any[]
    changes: any[]
    error?: string
  }>
}

export type FetchOptions =
  | undefined
  | {
      isRetrying?: boolean
      type?: string
      query?: Object
      headers?: Object
      body?: Object
    }
